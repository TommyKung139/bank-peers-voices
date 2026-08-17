export type Bank = {
  id: string;
  name: string;
  shortName: string;
  color: string;
  googlePlayId: string;
  appStoreId: string;
};

export const BANKS: Bank[] = [
  {
    id: "cathay",
    name: "國泰世華銀行",
    shortName: "國泰",
    color: "#0055a5",
    googlePlayId: "com.cathaybk.mymobibank.android",
    appStoreId: "373500505",
  },
  {
    id: "esun",
    name: "玉山銀行",
    shortName: "玉山",
    color: "#00954e",
    googlePlayId: "com.esunbank",
    appStoreId: "405033836",
  },
  {
    id: "ctbc",
    name: "中國信託銀行",
    shortName: "中信",
    color: "#e4632c",
    googlePlayId: "com.chinatrust.mobilebank",
    appStoreId: "417698185",
  },
  {
    id: "fubon",
    name: "台北富邦銀行",
    shortName: "富邦",
    color: "#003da5",
    googlePlayId: "com.fubon.aibank",
    appStoreId: "6479990131",
  },
  {
    id: "taishin",
    name: "台新銀行 Richart",
    shortName: "台新",
    color: "#8a3ab9",
    googlePlayId: "tw.com.taishinbank.richart",
    appStoreId: "1079733142",
  },
  {
    id: "linebank",
    name: "LINE Bank",
    shortName: "LineBank",
    color: "#06c755",
    googlePlayId: "com.linebank.tw",
    appStoreId: "1527512597",
  },
];

export function getBank(id: string): Bank | undefined {
  return BANKS.find((b) => b.id === id);
}
