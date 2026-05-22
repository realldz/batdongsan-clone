import React from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Heart,
  Share2,
  Home,
  Bed,
  Bath,
  Compass,
  Calendar,
  User,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Menu,
  Lock,
  Mail,
  Info,
  Filter,
  Eye,
  Image as ImageIcon,
  Camera,
  DollarSign,
  Maximize2,
  Map,
  FileText,
  UserCheck,
  Bell,
  Wallet,
  ArrowRight,
  TrendingUp,
  History,
  CreditCard,
  Grid,
  List,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { ZaloIcon, BdsLogo } from "./custom-icons";

const iconMap = {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Heart,
  Share2,
  Home,
  Bed,
  Bath,
  Compass,
  Calendar,
  User,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Menu,
  Lock,
  Mail,
  Info,
  Filter,
  Eye,
  Image: ImageIcon,
  Camera,
  DollarSign,
  Maximize2,
  Map,
  FileText,
  UserCheck,
  Bell,
  Wallet,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  History,
  CreditCard,
  Grid,
  List,
  AlertCircle,
  Zalo: ZaloIcon,
  BdsLogo: BdsLogo,
};

export type IconName = keyof typeof iconMap;

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number | string;
  className?: string;
}

export const Icon = ({ name, size = 16, className, ...props }: IconProps) => {
  const SelectedIcon = iconMap[name];

  if (!SelectedIcon) {
    console.warn(`Icon "${name}" not found in Icon registry.`);
    return null;
  }

  if (name === "BdsLogo") {
    return <SelectedIcon size={size} className={className} {...(props as any)} />;
  }

  return <SelectedIcon size={size} className={className} {...(props as any)} />;
};
