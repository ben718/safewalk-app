import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge.
 * This ensures Tailwind classes are properly merged without conflicts.
 *
 * Usage:
 * ```tsx
 * cn("px-4 py-2", isActive && "bg-primary", className)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Valide le format d'un numéro de téléphone français
 * Format accepté : +33 suivi de 9 chiffres (ex: +33612345678)
 * 
 * @param phone - Le numéro de téléphone à valider
 * @returns true si le format est valide, false sinon
 * 
 * Usage:
 * ```tsx
 * if (!validatePhoneNumber(phone)) {
 *   alert('Format invalide. Utilisez +33 suivi de 9 chiffres.');
 * }
 * ```
 */
export function validatePhoneNumber(phone: string): boolean {
  if (!phone || phone.trim() === '') {
    return false;
  }
  const phoneRegex = /^\+33[0-9]{9}$/;
  return phoneRegex.test(phone.trim());
}

/**
 * Formate un numéro de téléphone pour l'affichage
 * Transforme +33612345678 en +33 6 12 34 56 78
 * 
 * @param phone - Le numéro de téléphone à formater
 * @returns Le numéro formaté
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone || !validatePhoneNumber(phone)) {
    return phone;
  }
  const cleaned = phone.trim();
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`;
}
