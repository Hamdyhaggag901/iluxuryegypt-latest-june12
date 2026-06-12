import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  Download,
  FileSpreadsheet,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  FileText,
  Info
} from "lucide-react";

interface ParsedTour {
  rowNumber: number;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  heroImage: string;
  gallery: string[];
  duration: string;
  price: number;
  currency: string;
  category: string;
  groupSize: string;
  difficulty: string;
  destinations: string[];
  includes: string[];
  excludes: string[];
  featured: boolean;
  published: boolean;
  itinerary: any[];
  errors: string[];
  isValid: boolean;
}

interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: { row: number; message: string }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminToursBulk() {
  const [, setLocation] = useLocation();
  const [parsedTours, setParsedTours] = useState<ParsedTour[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Fetch categories for validation
  const { data: categoriesData } = useQuery<{ success: boolean; categories: Category[] }>({
    queryKey: ["/api/public/categories"],
    queryFn: async () => {
      const res = await fetch("/api/public/categories");
      return res.json();
    }
  });
  const categories = categoriesData?.categories || [];

  // Generate example CSV content
  const generateExampleCSV = () => {
    const headers = [
      "title",
      "slug",
      "description",
      "short_description",
      "hero_image",
      "gallery",
      "duration",
      "price",
      "currency",
      "category",
      "group_size",
      "difficulty",
      "destinations",
      "includes",
      "excludes",
      "featured",
      "published",
      "itinerary"
    ];

    const exampleRow1 = [
      "Pyramids of Giza Day Tour",
      "pyramids-giza-day-tour",
      "Experience the magnificent Pyramids of Giza and the Great Sphinx on this unforgettable day tour. Marvel at one of the Seven Wonders of the Ancient World while learning about Egypt's fascinating history.",
      "Explore the iconic Pyramids and Sphinx in a full-day guided tour",
      "https://example.com/images/pyramids-hero.jpg",
      "https://example.com/images/pyramids-1.jpg|https://example.com/images/pyramids-2.jpg|https://example.com/images/sphinx.jpg",
      "8 hours",
      "120",
      "USD",
      "Day Tours",
      "2-15 people",
      "Easy",
      "Cairo|Giza",
      "Air-conditioned transport|Professional Egyptologist guide|Entrance fees|Bottled water|Lunch",
      "Personal expenses|Tips|Travel insurance",
      "true",
      "true",
      "Day 1: Morning pickup from hotel|Visit the Great Pyramid of Khufu|Explore the Pyramid of Khafre|See the Great Sphinx|Lunch at local restaurant|Return to hotel"
    ];

    const exampleRow2 = [
      "Luxor Temple Night Tour",
      "luxor-temple-night-tour",
      "Discover the magic of Luxor Temple illuminated at night. This evening tour offers a unique perspective on one of Egypt's most beautiful ancient monuments.",
      "Evening tour of the stunning Luxor Temple",
      "https://example.com/images/luxor-night.jpg",
      "https://example.com/images/luxor-1.jpg|https://example.com/images/luxor-2.jpg",
      "3 hours",
      "65",
      "USD",
      "Day Tours",
      "2-20 people",
      "Easy",
      "Luxor",
      "Hotel pickup and drop-off|Expert local guide|Entrance fees|Bottled water",
      "Dinner|Personal expenses|Tips",
      "false",
      "true",
      "Evening: Hotel pickup|Guided tour of Luxor Temple|Photo opportunities|Return to hotel"
    ];

    const csvContent = [
      headers.join(","),
      exampleRow1.map(cell => `"${cell.replace(/"/g, '""')}"`).join(","),
      exampleRow2.map(cell => `"${cell.replace(/"/g, '""')}"`).join(",")
    ].join("\n");

    return csvContent;
  };

  // Download example template
  const handleDownloadTemplate = () => {
    const csvContent = generateExampleCSV();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tours_template.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Parse CSV content
  const parseCSV = (content: string): string[][] => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = "";
    let inQuotes = false;

    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      const nextChar = content[i + 1];

      if (inQuotes) {
        if (char === '"' && nextChar === '"') {
          currentCell += '"';
          i++; // Skip next quote
        } else if (char === '"') {
          inQuotes = false;
        } else {
          currentCell += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ",") {
          currentRow.push(currentCell.trim());
          currentCell = "";
        } else if (char === "\n" || (char === "\r" && nextChar === "\n")) {
          currentRow.push(currentCell.trim());
          if (currentRow.some(cell => cell !== "")) {
            rows.push(currentRow);
          }
          currentRow = [];
          currentCell = "";
          if (char === "\r") i++; // Skip \n
        } else if (char !== "\r") {
          currentCell += char;
        }
      }
    }

    // Don't forget the last cell/row
    if (currentCell || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(cell => cell !== "")) {
        rows.push(currentRow);
      }
    }

    return rows;
  };

  // Create slug from title
  const createSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Parse file and validate
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsingFile(true);
    setParseError(null);
    setParsedTours([]);
    setImportResult(null);

    try {
      const content = await file.text();
      const rows = parseCSV(content);

      if (rows.length < 2) {
        setParseError("The file must contain at least a header row and one data row.");
        setIsParsingFile(false);
        return;
      }

      const headers = rows[0].map(h => h.toLowerCase().replace(/\s+/g, "_"));
      const expectedHeaders = [
        "title", "description", "short_description", "hero_image", "gallery",
        "duration", "price", "currency", "category", "group_size", "difficulty",
        "destinations", "includes", "excludes", "featured", "published", "itinerary"
      ];
      // slug is optional - will be auto-generated if not provided

      // Check for required headers
      const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        setParseError(`Missing required columns: ${missingHeaders.join(", ")}`);
        setIsParsingFile(false);
        return;
      }

      const parsed: ParsedTour[] = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const errors: string[] = [];

        const getValue = (header: string): string => {
          const idx = headers.indexOf(header);
          return idx >= 0 && idx < row.length ? row[idx] : "";
        };

        const title = getValue("title");
        const slugRaw = getValue("slug");
        const description = getValue("description");
        const shortDescription = getValue("short_description");
        const heroImage = getValue("hero_image");
        const gallery = getValue("gallery").split("|").filter(Boolean);
        const duration = getValue("duration");
        const priceStr = getValue("price");
        const currency = getValue("currency") || "USD";
        const category = getValue("category");
        const groupSize = getValue("group_size");
        const difficulty = getValue("difficulty") || "Easy";
        const destinations = getValue("destinations").split("|").filter(Boolean);
        const includes = getValue("includes").split("|").filter(Boolean);
        const excludes = getValue("excludes").split("|").filter(Boolean);
        const featuredStr = getValue("featured").toLowerCase();
        const publishedStr = getValue("published").toLowerCase();
        const itineraryStr = getValue("itinerary");

        // Use provided slug or generate from title
        const slug = slugRaw ? slugRaw.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim() : createSlug(title);

        // Validation
        if (!title) errors.push("Title is required");
        if (!description) errors.push("Description is required");
        if (!heroImage) errors.push("Hero image URL is required");
        if (!duration) errors.push("Duration is required");
        if (!priceStr || isNaN(Number(priceStr))) errors.push("Valid price is required");
        if (!category) errors.push("Category is required");

        // Validate category exists
        if (category && categories.length > 0) {
          const categoryExists = categories.some(
            c => c.name.toLowerCase() === category.toLowerCase() || c.slug === category.toLowerCase()
          );
          if (!categoryExists) {
            errors.push(`Category "${category}" not found. Available: ${categories.map(c => c.name).join(", ")}`);
          }
        }

        // Validate URL format
        const urlPattern = /^https?:\/\/.+/i;
        if (heroImage && !urlPattern.test(heroImage)) {
          errors.push("Hero image must be a valid URL");
        }
        gallery.forEach((url, idx) => {
          if (!urlPattern.test(url)) {
            errors.push(`Gallery image ${idx + 1} must be a valid URL`);
          }
        });

        // Parse itinerary
        const itinerary: any[] = [];
        if (itineraryStr) {
          const days = itineraryStr.split("|");
          days.forEach((day, idx) => {
            const parts = day.split(":");
            const dayTitle = parts[0]?.trim() || `Day ${idx + 1}`;
            const activities = parts.slice(1).join(":").trim();
            itinerary.push({
              day: idx + 1,
              title: dayTitle,
              description: activities || dayTitle,
              activities: activities ? [activities] : []
            });
          });
        }

        parsed.push({
          rowNumber: i + 1,
          title,
          slug,
          description,
          shortDescription,
          heroImage,
          gallery,
          duration,
          price: Number(priceStr) || 0,
          currency,
          category,
          groupSize,
          difficulty,
          destinations,
          includes,
          excludes,
          featured: featuredStr === "true" || featuredStr === "yes" || featuredStr === "1",
          published: publishedStr !== "false" && publishedStr !== "no" && publishedStr !== "0",
          itinerary,
          errors,
          isValid: errors.length === 0
        });
      }

      setParsedTours(parsed);
    } catch (err) {
      console.error("Error parsing file:", err);
      setParseError("Failed to parse the file. Please ensure it's a valid CSV file.");
    } finally {
      setIsParsingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Import mutation
  const importMutation = useMutation({
    mutationFn: async (tours: ParsedTour[]) => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No auth token");

      const validTours = tours.filter(t => t.isValid);
      const toursToImport = validTours.map(t => ({
        title: t.title,
        slug: t.slug,
        description: t.description,
        shortDescription: t.shortDescription,
        heroImage: t.heroImage,
        gallery: t.gallery,
        duration: t.duration,
        price: t.price,
        currency: t.currency,
        category: t.category,
        groupSize: t.groupSize,
        difficulty: t.difficulty,
        destinations: t.destinations,
        includes: t.includes,
        excludes: t.excludes,
        featured: t.featured,
        published: t.published,
        itinerary: t.itinerary
      }));

      const response = await fetch("/api/cms/tours/bulk-import", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tours: toursToImport })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Import failed");
      }

      return response.json();
    },
    onSuccess: (result) => {
      setImportResult(result);
      queryClient.invalidateQueries({ queryKey: ["/api/cms/tours"] });
    },
    onError: (error: Error) => {
      setImportResult({
        success: false,
        imported: 0,
        failed: parsedTours.filter(t => t.isValid).length,
        errors: [{ row: 0, message: error.message }]
      });
    }
  });

  const handleImport = () => {
    const validTours = parsedTours.filter(t => t.isValid);
    if (validTours.length === 0) {
      setParseError("No valid tours to import. Please fix the errors first.");
      return;
    }
    importMutation.mutate(parsedTours);
  };

  const validCount = parsedTours.filter(t => t.isValid).length;
  const invalidCount = parsedTours.filter(t => !t.isValid).length;

  return (
    <AdminLayout title="Bulk Import Tours" description="Import multiple tours from CSV file">
      <div className="space-y-6">
        {/* Back button */}
        <Button
          variant="outline"
          onClick={() => setLocation("/admin/tours")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tours
        </Button>

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              How to Import Tours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Step 1: Download Template</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Download the example CSV template with all required columns and sample data.
                </p>
                <Button onClick={handleDownloadTemplate} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template CSV
                </Button>
              </div>
              <div>
                <h4 className="font-medium mb-2">Step 2: Fill Your Data</h4>
                <p className="text-sm text-muted-foreground">
                  Fill in the template with your tour data. Use the pipe character (|) to separate multiple values in array fields like gallery, destinations, includes, excludes, and itinerary.
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Column Reference</h4>
              <ScrollArea className="h-48">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div><Badge variant="outline">title</Badge> - Tour name (required)</div>
                  <div><Badge variant="outline">slug</Badge> - Custom URL (optional, auto-generated if empty)</div>
                  <div><Badge variant="outline">description</Badge> - Full description (required)</div>
                  <div><Badge variant="outline">short_description</Badge> - Brief summary</div>
                  <div><Badge variant="outline">hero_image</Badge> - Main image URL (required)</div>
                  <div><Badge variant="outline">gallery</Badge> - Image URLs separated by |</div>
                  <div><Badge variant="outline">duration</Badge> - e.g., "3 days" (required)</div>
                  <div><Badge variant="outline">price</Badge> - Number (required)</div>
                  <div><Badge variant="outline">currency</Badge> - e.g., USD (default: USD)</div>
                  <div><Badge variant="outline">category</Badge> - Category name (required)</div>
                  <div><Badge variant="outline">group_size</Badge> - e.g., "2-15 people"</div>
                  <div><Badge variant="outline">difficulty</Badge> - Easy/Moderate/Challenging</div>
                  <div><Badge variant="outline">destinations</Badge> - Locations separated by |</div>
                  <div><Badge variant="outline">includes</Badge> - Inclusions separated by |</div>
                  <div><Badge variant="outline">excludes</Badge> - Exclusions separated by |</div>
                  <div><Badge variant="outline">featured</Badge> - true/false</div>
                  <div><Badge variant="outline">published</Badge> - true/false</div>
                  <div><Badge variant="outline">itinerary</Badge> - Day:Activities separated by |</div>
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload CSV File
            </CardTitle>
            <CardDescription>
              Select a CSV file to upload and preview before importing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-muted-foreground">
                  CSV files only
                </span>
              </label>
            </div>

            {isParsingFile && (
              <div className="flex items-center justify-center mt-4 gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Parsing file...</span>
              </div>
            )}

            {parseError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{parseError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Preview Table */}
        {parsedTours.length > 0 && !importResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Preview ({parsedTours.length} tours)</span>
                <div className="flex gap-2">
                  <Badge variant="default" className="bg-green-600">
                    <Check className="h-3 w-3 mr-1" />
                    {validCount} Valid
                  </Badge>
                  {invalidCount > 0 && (
                    <Badge variant="destructive">
                      <X className="h-3 w-3 mr-1" />
                      {invalidCount} Invalid
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Row</TableHead>
                      <TableHead className="w-16">Status</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>URL (Slug)</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Errors</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedTours.map((tour) => (
                      <TableRow key={tour.rowNumber} className={tour.isValid ? "" : "bg-red-50"}>
                        <TableCell>{tour.rowNumber}</TableCell>
                        <TableCell>
                          {tour.isValid ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{tour.title || "-"}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{tour.slug || "-"}</TableCell>
                        <TableCell>{tour.category || "-"}</TableCell>
                        <TableCell>{tour.duration || "-"}</TableCell>
                        <TableCell>
                          {tour.price} {tour.currency}
                        </TableCell>
                        <TableCell>
                          {tour.errors.length > 0 && (
                            <ul className="text-xs text-red-600 list-disc list-inside">
                              {tour.errors.map((err, idx) => (
                                <li key={idx}>{err}</li>
                              ))}
                            </ul>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setParsedTours([]);
                    setParseError(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={validCount === 0 || importMutation.isPending}
                >
                  {importMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Import {validCount} Tour{validCount !== 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Import Result */}
        {importResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {importResult.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                Import {importResult.success ? "Complete" : "Failed"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="bg-green-50 rounded-lg p-4 flex-1">
                    <div className="text-2xl font-bold text-green-600">
                      {importResult.imported}
                    </div>
                    <div className="text-sm text-green-700">Tours Imported</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 flex-1">
                    <div className="text-2xl font-bold text-red-600">
                      {importResult.failed}
                    </div>
                    <div className="text-sm text-red-700">Failed</div>
                  </div>
                </div>

                {importResult.errors && importResult.errors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Import Errors</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside mt-2">
                        {importResult.errors.map((err, idx) => (
                          <li key={idx}>
                            {err.row > 0 ? `Row ${err.row}: ` : ""}{err.message}
                          </li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setParsedTours([]);
                      setImportResult(null);
                      setParseError(null);
                    }}
                  >
                    Import More
                  </Button>
                  <Button onClick={() => setLocation("/admin/tours")}>
                    Go to Tours
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
