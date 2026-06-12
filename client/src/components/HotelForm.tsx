import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertHotelSchema, roomSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2, Trash2, ImagePlus } from "lucide-react";

const hotelFormSchema = insertHotelSchema.extend({
  rating: z.union([z.number(), z.string().min(1)]).transform((val) =>
    typeof val === "string" ? Number(val) : val
  ),
});

type HotelFormData = z.infer<typeof hotelFormSchema>;
type RoomData = z.infer<typeof roomSchema>;

interface HotelFormProps {
  initialData?: Partial<any>;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function HotelForm({ initialData, onSubmit, isLoading }: HotelFormProps) {
  const [amenitiesInput, setAmenitiesInput] = useState("");
  const [highlightsInput, setHighlightsInput] = useState("");
  const [galleryInput, setGalleryInput] = useState("");
  const [roomAmenitiesInput, setRoomAmenitiesInput] = useState<Record<number, string>>({});

  const form = useForm<HotelFormData>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      location: "",
      region: "",
      type: "",
      rating: 5,
      priceTier: "",
      amenities: [],
      image: "",
      description: "",
      fullDescription: "",
      highlights: [],
      gallery: [],
      rooms: [],
      featured: false,
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        form.setValue(key as any, initialData[key]);
      });
    }
  }, [initialData, form]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);
    if (!initialData?.slug) {
      form.setValue("slug", generateSlug(name));
    }
  };

  const addArrayItem = (field: "amenities" | "highlights" | "gallery", value: string) => {
    if (!value.trim()) return;
    const currentValues = form.getValues(field) || [];
    form.setValue(field, [...currentValues, value.trim()]);
  };

  const removeArrayItem = (field: "amenities" | "highlights" | "gallery", index: number) => {
    const currentValues = form.getValues(field) || [];
    form.setValue(field, currentValues.filter((_: any, i: number) => i !== index));
  };

  // Room management functions
  const addRoom = () => {
    const currentRooms = form.getValues("rooms") || [];
    const newRoom: RoomData = {
      id: `room-${Date.now()}`,
      name: "",
      description: "",
      size: "",
      occupancy: 2,
      amenities: [],
      images: [],
    };
    form.setValue("rooms", [...currentRooms, newRoom]);
  };

  const removeRoom = (index: number) => {
    const currentRooms = form.getValues("rooms") || [];
    form.setValue("rooms", currentRooms.filter((_: any, i: number) => i !== index));
  };

  const updateRoom = (index: number, field: keyof RoomData, value: any) => {
    const currentRooms = form.getValues("rooms") || [];
    const updatedRooms = [...currentRooms];
    updatedRooms[index] = { ...updatedRooms[index], [field]: value };
    form.setValue("rooms", updatedRooms);
  };

  const addRoomAmenity = (roomIndex: number, value: string) => {
    if (!value.trim()) return;
    const currentRooms = form.getValues("rooms") || [];
    const room = currentRooms[roomIndex];
    if (room) {
      const updatedAmenities = [...(room.amenities || []), value.trim()];
      updateRoom(roomIndex, "amenities", updatedAmenities);
    }
  };

  const removeRoomAmenity = (roomIndex: number, amenityIndex: number) => {
    const currentRooms = form.getValues("rooms") || [];
    const room = currentRooms[roomIndex];
    if (room) {
      const updatedAmenities = (room.amenities || []).filter((_: any, i: number) => i !== amenityIndex);
      updateRoom(roomIndex, "amenities", updatedAmenities);
    }
  };

  const addRoomImage = (roomIndex: number, url: string) => {
    if (!url.trim()) return;
    const currentRooms = form.getValues("rooms") || [];
    const room = currentRooms[roomIndex];
    if (room && (room.images || []).length < 2) {
      const updatedImages = [...(room.images || []), url.trim()];
      updateRoom(roomIndex, "images", updatedImages);
    }
  };

  const removeRoomImage = (roomIndex: number, imageIndex: number) => {
    const currentRooms = form.getValues("rooms") || [];
    const room = currentRooms[roomIndex];
    if (room) {
      const updatedImages = (room.images || []).filter((_: any, i: number) => i !== imageIndex);
      updateRoom(roomIndex, "images", updatedImages);
    }
  };

  const handleSubmit = (data: HotelFormData) => {
    const transformedData = {
      ...data,
      rating: Number(data.rating),
      amenities: (data.amenities || []).filter(a => a.trim().length > 0),
      highlights: (data.highlights || []).filter(h => h.trim().length > 0),
      gallery: (data.gallery || []).filter(g => g.trim().length > 0),
      rooms: (data.rooms || []).map(room => ({
        ...room,
        occupancy: Number(room.occupancy),
        amenities: (room.amenities || []).filter((a: string) => a.trim().length > 0),
        images: (room.images || []).filter((i: string) => i.trim().length > 0),
      })),
    };
    onSubmit(transformedData);
  };

  const rooms = form.watch("rooms") || [];

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5" data-testid="tabs-hotel-form">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="content" data-testid="tab-content">Content</TabsTrigger>
          <TabsTrigger value="media" data-testid="tab-media">Media</TabsTrigger>
          <TabsTrigger value="rooms" data-testid="tab-rooms">Rooms & Suites</TabsTrigger>
          <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Main details about the hotel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Hotel Name *</Label>
                  <Input
                    id="name"
                    data-testid="input-hotel-name"
                    {...form.register("name")}
                    onChange={handleNameChange}
                    placeholder="e.g., Mena House Hotel"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{String(form.formState.errors.name.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    data-testid="input-hotel-slug"
                    {...form.register("slug")}
                    placeholder="mena-house-hotel"
                  />
                  {form.formState.errors.slug && (
                    <p className="text-sm text-destructive">{String(form.formState.errors.slug.message)}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Hotel Type *</Label>
                  <Select
                    value={form.watch("type")}
                    onValueChange={(value) => form.setValue("type", value)}
                  >
                    <SelectTrigger data-testid="select-hotel-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Palace">Palace</SelectItem>
                      <SelectItem value="Resort">Resort</SelectItem>
                      <SelectItem value="Boutique">Boutique</SelectItem>
                      <SelectItem value="Luxury Hotel">Luxury Hotel</SelectItem>
                      <SelectItem value="Historic">Historic</SelectItem>
                      <SelectItem value="Eco Lodge">Eco Lodge</SelectItem>
                      <SelectItem value="Beach Resort">Beach Resort</SelectItem>
                      <SelectItem value="Desert Camp">Desert Camp</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.type && (
                    <p className="text-sm text-destructive">{String(form.formState.errors.type.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Star Rating *</Label>
                  <Select
                    value={form.watch("rating")?.toString()}
                    onValueChange={(value) => form.setValue("rating", parseInt(value) as any)}
                  >
                    <SelectTrigger data-testid="select-hotel-rating">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="1">1 Star</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.rating && (
                    <p className="text-sm text-destructive">{String(form.formState.errors.rating.message)}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    data-testid="input-hotel-location"
                    {...form.register("location")}
                    placeholder="e.g., Giza"
                  />
                  {form.formState.errors.location && (
                    <p className="text-sm text-destructive">{String(form.formState.errors.location.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Region *</Label>
                  <Select
                    value={form.watch("region")}
                    onValueChange={(value) => form.setValue("region", value)}
                  >
                    <SelectTrigger data-testid="select-hotel-region">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cairo & Giza">Cairo & Giza</SelectItem>
                      <SelectItem value="Luxor">Luxor</SelectItem>
                      <SelectItem value="Aswan">Aswan</SelectItem>
                      <SelectItem value="Alexandria">Alexandria</SelectItem>
                      <SelectItem value="Red Sea">Red Sea</SelectItem>
                      <SelectItem value="Sinai">Sinai</SelectItem>
                      <SelectItem value="Siwa Oasis">Siwa Oasis</SelectItem>
                      <SelectItem value="Western Desert">Western Desert</SelectItem>
                      <SelectItem value="Nile Cruise">Nile Cruise</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.region && (
                    <p className="text-sm text-destructive">{String(form.formState.errors.region.message)}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceTier">Price Tier *</Label>
                <Select
                  value={form.watch("priceTier")}
                  onValueChange={(value) => form.setValue("priceTier", value)}
                >
                  <SelectTrigger data-testid="select-hotel-price-tier">
                    <SelectValue placeholder="Select price tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$">$ - Budget</SelectItem>
                    <SelectItem value="$$">$$ - Moderate</SelectItem>
                    <SelectItem value="$$$">$$$ - Upscale</SelectItem>
                    <SelectItem value="$$$$">$$$$ - Luxury</SelectItem>
                    <SelectItem value="$$$$$">$$$$$ - Ultra Luxury</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.priceTier && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.priceTier.message)}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hotel Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Short Description * (for cards)</Label>
                <Textarea
                  id="description"
                  data-testid="input-hotel-description"
                  {...form.register("description")}
                  placeholder="Brief overview for hotel cards and previews..."
                  rows={3}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.description.message)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullDescription">Full Description (for detail page)</Label>
                <Textarea
                  id="fullDescription"
                  data-testid="input-hotel-full-description"
                  {...form.register("fullDescription")}
                  placeholder="Detailed hotel description with history, unique features, etc..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hotel Highlights</CardTitle>
              <CardDescription>Key features to display on the hotel page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Add Highlight</Label>
                <div className="flex gap-2">
                  <Input
                    value={highlightsInput}
                    onChange={(e) => setHighlightsInput(e.target.value)}
                    placeholder="e.g., Pyramid views from every room"
                    data-testid="input-highlights"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem("highlights", highlightsInput);
                        setHighlightsInput("");
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      addArrayItem("highlights", highlightsInput);
                      setHighlightsInput("");
                    }}
                    data-testid="button-add-highlights"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.watch("highlights")?.map((item: string, index: number) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {item}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("highlights", index)}
                        className="ml-1"
                        data-testid={`button-remove-highlights-${index}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hotel Amenities</CardTitle>
              <CardDescription>Facilities and services available</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Add Amenity</Label>
                <div className="flex gap-2">
                  <Input
                    value={amenitiesInput}
                    onChange={(e) => setAmenitiesInput(e.target.value)}
                    placeholder="e.g., Spa, Pool, Fine Dining"
                    data-testid="input-amenities"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem("amenities", amenitiesInput);
                        setAmenitiesInput("");
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      addArrayItem("amenities", amenitiesInput);
                      setAmenitiesInput("");
                    }}
                    data-testid="button-add-amenities"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.watch("amenities")?.map((item: string, index: number) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {item}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("amenities", index)}
                        className="ml-1"
                        data-testid={`button-remove-amenities-${index}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Image</CardTitle>
              <CardDescription>Main image displayed at the top of the hotel page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">Hero Image URL *</Label>
                <Input
                  id="image"
                  data-testid="input-hotel-image"
                  {...form.register("image")}
                  placeholder="https://example.com/hotel-hero.jpg"
                />
                {form.formState.errors.image && (
                  <p className="text-sm text-destructive">{String(form.formState.errors.image.message)}</p>
                )}
                {form.watch("image") && (
                  <div className="mt-2">
                    <img
                      src={form.watch("image")}
                      alt="Hero preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gallery Images</CardTitle>
              <CardDescription>Additional images for the hotel gallery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Add Gallery Image</Label>
                <div className="flex gap-2">
                  <Input
                    value={galleryInput}
                    onChange={(e) => setGalleryInput(e.target.value)}
                    placeholder="https://example.com/gallery-image.jpg"
                    data-testid="input-gallery-url"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      addArrayItem("gallery", galleryInput);
                      setGalleryInput("");
                    }}
                    data-testid="button-add-gallery"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {form.watch("gallery")?.map((url: string, index: number) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x100?text=Invalid+URL';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem("gallery", index)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        data-testid={`button-remove-gallery-${index}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rooms Tab */}
        <TabsContent value="rooms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rooms & Suites</CardTitle>
              <CardDescription>Add different room types with descriptions, sizes, and amenities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rooms.map((room: RoomData, index: number) => (
                <Card key={room.id} className="border-2">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Room {index + 1}</CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRoom(index)}
                        className="text-destructive hover:text-destructive"
                        data-testid={`button-remove-room-${index}`}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Room Name *</Label>
                        <Input
                          value={room.name}
                          onChange={(e) => updateRoom(index, "name", e.target.value)}
                          placeholder="e.g., Deluxe Room"
                          data-testid={`input-room-name-${index}`}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label>Size *</Label>
                          <Input
                            value={room.size}
                            onChange={(e) => updateRoom(index, "size", e.target.value)}
                            placeholder="e.g., 42 sqm"
                            data-testid={`input-room-size-${index}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Occupancy *</Label>
                          <Input
                            type="number"
                            value={room.occupancy}
                            onChange={(e) => updateRoom(index, "occupancy", parseInt(e.target.value) || 1)}
                            min={1}
                            data-testid={`input-room-occupancy-${index}`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Room Description *</Label>
                      <Textarea
                        value={room.description}
                        onChange={(e) => updateRoom(index, "description", e.target.value)}
                        placeholder="Describe the room..."
                        rows={3}
                        data-testid={`input-room-description-${index}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Room Amenities</Label>
                      <div className="flex gap-2">
                        <Input
                          value={roomAmenitiesInput[index] || ""}
                          onChange={(e) => setRoomAmenitiesInput({ ...roomAmenitiesInput, [index]: e.target.value })}
                          placeholder="e.g., City View, Mini Bar"
                          data-testid={`input-room-amenities-${index}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addRoomAmenity(index, roomAmenitiesInput[index] || "");
                              setRoomAmenitiesInput({ ...roomAmenitiesInput, [index]: "" });
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            addRoomAmenity(index, roomAmenitiesInput[index] || "");
                            setRoomAmenitiesInput({ ...roomAmenitiesInput, [index]: "" });
                          }}
                          data-testid={`button-add-room-amenity-${index}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(room.amenities || []).map((amenity: string, amenityIndex: number) => (
                          <Badge key={amenityIndex} variant="secondary" className="gap-1">
                            {amenity}
                            <button
                              type="button"
                              onClick={() => removeRoomAmenity(index, amenityIndex)}
                              className="ml-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Room Images (max 2)</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://example.com/room-image.jpg"
                          data-testid={`input-room-image-${index}`}
                          disabled={(room.images || []).length >= 2}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addRoomImage(index, (e.target as HTMLInputElement).value);
                              (e.target as HTMLInputElement).value = "";
                            }
                          }}
                        />
                        <Button
                          type="button"
                          disabled={(room.images || []).length >= 2}
                          onClick={(e) => {
                            const input = (e.target as HTMLElement).parentElement?.querySelector('input');
                            if (input) {
                              addRoomImage(index, input.value);
                              input.value = "";
                            }
                          }}
                          data-testid={`button-add-room-image-${index}`}
                        >
                          <ImagePlus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {(room.images || []).map((url: string, imageIndex: number) => (
                          <div key={imageIndex} className="relative group">
                            <img
                              src={url}
                              alt={`${room.name} ${imageIndex + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x100?text=Invalid+URL';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeRoomImage(index, imageIndex)}
                              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      {(room.images || []).length === 0 && (
                        <p className="text-sm text-muted-foreground">Add up to 2 images for this room type</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addRoom}
                className="w-full"
                data-testid="button-add-room"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Room Type
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hotel Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">Featured Hotel</Label>
                  <p className="text-sm text-muted-foreground">Show this hotel prominently on the website</p>
                </div>
                <Switch
                  id="featured"
                  checked={form.watch("featured")}
                  onCheckedChange={(checked) => form.setValue("featured", checked)}
                  data-testid="switch-hotel-featured"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button
          type="submit"
          disabled={isLoading}
          data-testid="button-submit-hotel"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Hotel" : "Create Hotel"}
        </Button>
      </div>
    </form>
  );
}
