import { Transitaire, Colis } from "../types";

export const DEFAULT_TRANSITAIRES: Transitaire[] = [
  { id: "t-1", nom: "CI Transit Express" },
  { id: "t-2", nom: "Abidjan Cargo Service" }
];

export const DEFAULT_COLIS: Colis[] = [
  {
    id: "c-1",
    code: "C-101",
    transitaireId: "t-1",
    dateEnregistrement: "2026-07-01",
    poidsTotal: 15.5,
    type: "Simple",
    parts: [
      {
        id: "p-1",
        nomClient: "Mamadou Koné",
        poidsAttribue: 15.5,
        montantDu: 45000,
        montantPaye: 30000
      }
    ]
  },
  {
    id: "c-2",
    code: "C-102",
    transitaireId: "t-2",
    dateEnregistrement: "2026-07-02",
    poidsTotal: 28.0,
    type: "Mixte",
    parts: [
      {
        id: "p-2",
        nomClient: "Awa Touré",
        poidsAttribue: 10.0,
        montantDu: 30000,
        montantPaye: 30000
      },
      {
        id: "p-3",
        nomClient: "Koffi Yao",
        poidsAttribue: 18.0,
        montantDu: 54000,
        montantPaye: 20000
      }
    ]
  }
];
