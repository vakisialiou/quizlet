-- CreateIndex
CREATE INDEX `RelationTerm_userId_folderId_idx` ON `RelationTerm`(`userId`, `folderId`);

-- CreateIndex
CREATE INDEX `RelationTerm_userId_moduleId_idx` ON `RelationTerm`(`userId`, `moduleId`);
