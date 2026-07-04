export interface Transitaire {
  id: string;
  nom: string;
}

export interface PartColis {
  id: string;
  nomClient: string;
  poidsAttribue: number; // in kg
  montantDu: number; // manually entered
  montantPaye: number; // tracked amount
  estRetire?: boolean; // whether the package has been collected by the client
}

export type ColisType = "Simple" | "Mixte";

export interface Colis {
  id: string;
  code: string; // unique code ex "115"
  transitaireId: string;
  dateEnregistrement: string; // YYYY-MM-DD
  poidsTotal: number; // in kg, max 32
  type: ColisType;
  parts: PartColis[];
}

export interface PaymentLog {
  id: string;
  colisId: string;
  colisCode: string;
  partId: string;
  clientName: string;
  montantPaye: number;
  datePaiement: string;
  note?: string;
}
