-- CreateTable
CREATE TABLE "Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "avatar" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Categorie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Panier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Panier_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PanierProduit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "panierId" INTEGER NOT NULL,
    "produitId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "PanierProduit_panierId_fkey" FOREIGN KEY ("panierId") REFERENCES "Panier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PanierProduit_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Produit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "categorieId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Produit_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Auth" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "ExpirationToken" BIGINT NOT NULL,
    CONSTRAINT "Auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Commande" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "IsValidate" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Commande_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CommandeProduit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "commandeId" INTEGER NOT NULL,
    "produitId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "CommandeProduit_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "Commande" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CommandeProduit_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BlackList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "ExpirationToken" BIGINT NOT NULL,
    CONSTRAINT "BlackList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Panier_userId_key" ON "Panier"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_userId_key" ON "Auth"("userId");
