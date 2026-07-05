import { useState, useEffect } from "react";
import {
  getProvinces,
  getDistricts,
  getWards,
  getStreets,
  searchGeography,
  type GeographyDivision,
} from "@/services/geography";
import { EMPTY_ADDRESS } from "./CreateListingTypes";

export function useGeographyState(
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
) {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(EMPTY_ADDRESS);

  // Geography API states
  const [apiProvinces, setApiProvinces] = useState<GeographyDivision[]>([]);
  const [apiDistricts, setApiDistricts] = useState<GeographyDivision[]>([]);
  const [apiWards, setApiWards] = useState<GeographyDivision[]>([]);
  const [apiStreets, setApiStreets] = useState<GeographyDivision[]>([]);

  const [provinceId, setProvinceId] = useState<string>("");
  const [districtId, setDistrictId] = useState<string>("");
  const [wardId, setWardId] = useState<string>("");

  const [searchResults, setSearchResults] = useState<GeographyDivision[]>([]);
  const [searching, setSearching] = useState(false);

  // Load provinces on mount
  useEffect(() => {
    getProvinces()
      .then((data) => {
        setApiProvinces(data);
      })
      .catch((err) => {
        console.error("Failed to load provinces", err);
      });
  }, []);

  // Search autocomplete with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchGeography(searchQuery);
        setSearchResults(Array.isArray(results) ? results : []);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Geocode address when street or detail changes (debounced)
  useEffect(() => {
    const fullAddress = [
      selectedAddress.detail,
      selectedAddress.street,
      selectedAddress.district,
      selectedAddress.province,
    ]
      .filter(Boolean)
      .join(", ");

    if (!selectedAddress.province) return;
    if (!selectedAddress.detail && !selectedAddress.street) return;

    const delayDebounce = setTimeout(async () => {
      const { geocodeAddress } = await import("@/lib/geocoding");
      const coords = await geocodeAddress(fullAddress);
      if (coords) {
        setSelectedAddress((prev) => ({
          ...prev,
          lat: coords.lat,
          lng: coords.lng,
        }));
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [selectedAddress.street, selectedAddress.detail]);

  const handleProvinceChange = async (provId: string) => {
    const prov = apiProvinces.find((p) => p.id === provId);
    if (!prov) return;

    setProvinceId(provId);
    setDistrictId("");
    setWardId("");
    setApiWards([]);
    setApiStreets([]);

    setSelectedAddress((prev) => ({
      ...prev,
      province: prov.name,
      district: "",
      ward: "",
      street: "",
      lat: prov.lat || prev.lat,
      lng: prov.lon || prev.lng,
    }));

    try {
      const dists = await getDistricts(provId);
      setApiDistricts(dists);
    } catch (e) {
      console.error("Failed to load districts", e);
    }
  };

  const handleDistrictChange = async (distId: string) => {
    const dist = apiDistricts.find((d) => d.id === distId);
    if (!dist) return;

    setDistrictId(distId);
    setWardId("");
    setApiStreets([]);

    setSelectedAddress((prev) => ({
      ...prev,
      district: dist.name,
      ward: "",
      street: "",
      lat: dist.lat || prev.lat,
      lng: dist.lon || prev.lng,
    }));

    try {
      const strts = await getStreets(distId);
      setApiStreets(strts);
    } catch (e) {
      console.error("Failed to load streets", e);
    }
  };

  const handleWardChange = async (wrdId: string) => {
    const wrd = apiWards.find((w) => w.id === wrdId);
    if (!wrd) return;

    setWardId(wrdId);

    setSelectedAddress((prev) => ({
      ...prev,
      ward: wrd.name,
      street: "",
      lat: wrd.lat || prev.lat,
      lng: wrd.lon || prev.lng,
    }));

    try {
      const strts = await getStreets(wrdId);
      setApiStreets(strts);
    } catch (e) {
      console.error("Failed to load streets", e);
    }
  };

  const handleStreetChange = (streetName: string) => {
    setSelectedAddress((prev) => ({
      ...prev,
      street: streetName,
    }));
  };

  const handleSelectSearchResult = async (res: GeographyDivision) => {
    setIsAddressModalOpen(false);
    setIsConfirmModalOpen(true);

    const newAddr = {
      label: res.name,
      province: "",
      district: "",
      ward: "",
      street: "",
      project: "",
      detail: "",
      lat: res.lat,
      lng: res.lon,
    };

    if (res.type === "province") {
      newAddr.province = res.name;
      setSelectedAddress(newAddr);
      setProvinceId(res.id);
      setDistrictId("");
      setWardId("");
      setApiDistricts([]);
      setApiWards([]);
      setApiStreets([]);
    } else if (res.type === "district") {
      newAddr.district = res.name;
      const parentProv = apiProvinces.find((p) => p.id === res.parent);
      if (parentProv) {
        newAddr.province = parentProv.name;
        newAddr.label = `${res.name}, ${parentProv.name}`;
        setProvinceId(parentProv.id);
        setDistrictId(res.id);
        setWardId("");

        try {
          const dists = await getDistricts(parentProv.id);
          setApiDistricts(dists);
          const strts = await getStreets(res.id);
          setApiStreets(strts);
        } catch (e) {
          console.error(e);
        }
      }
      setSelectedAddress(newAddr);
    } else if (res.type === "ward") {
      newAddr.ward = res.name;
      setWardId(res.id);
      setSelectedAddress(newAddr);
    } else {
      setSelectedAddress(newAddr);
    }
  };

  const handleConfirmAddress = () => {
    setIsConfirmModalOpen(false);
    setIsAddressConfirmed(true);
    setExpanded({
      demand: false,
      address: true,
      main: true,
      other: true,
      contact: true,
      content: true,
    });
  };

  return {
    isAddressModalOpen,
    setIsAddressModalOpen,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    searchQuery,
    setSearchQuery,
    isAddressConfirmed,
    setIsAddressConfirmed,
    selectedAddress,
    setSelectedAddress,
    apiProvinces,
    apiDistricts,
    apiWards,
    apiStreets,
    provinceId,
    districtId,
    wardId,
    searchResults,
    setSearchResults,
    searching,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
    handleStreetChange,
    handleSelectSearchResult,
    handleConfirmAddress,
  };
}
