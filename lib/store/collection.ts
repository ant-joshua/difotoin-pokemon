import { Pokemon } from "../types/pokemon";

function getCollectionList(): Pokemon[] {
  const myCollectionList = localStorage.getItem("myCollectionList");
  if (!myCollectionList) {
    return [];
  }
  return JSON.parse(myCollectionList);
}

function addCollectionList(pokemon: Pokemon): boolean {
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
  localStorage.setItem("myCollectionList", JSON.stringify(collectionList));
}

export { getCollectionList, saveCollectionList, addCollectionList };
