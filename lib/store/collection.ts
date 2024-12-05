"use client";
import { Pokemon } from "../types/pokemon";

function getCollectionList(): Pokemon[] {
  if (typeof window === "undefined") {
    return [];
  }

  const myCollectionList = localStorage.getItem("myCollectionList");
  if (!myCollectionList) {
    return [];
  }
  return JSON.parse(myCollectionList);
}

function addCollectionList(pokemon: Pokemon): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  const collectionList = getCollectionList();
  if (collectionList.find((p) => p.code === pokemon.code)) {
    return false;
  }
  collectionList.push(pokemon);
  console.log(collectionList);

  saveCollectionList(collectionList);

  return true;
}

function saveCollectionList(collectionList: Pokemon[]) {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem("myCollectionList", JSON.stringify(collectionList));
}

export { getCollectionList, saveCollectionList, addCollectionList };
