export interface IS3Service<TFileInfo, TFile> {
	uploadFile(file: TFile): Promise<TFileInfo>;

	updateFile(key: string, file: TFile): Promise<TFileInfo>;

	deleteFile(key: string): Promise<void>;

	getSignedUrlForRead(key: string, expiresIn?: number): Promise<string>;

	getSignedUrlForWrite?(key: string, expiresIn?: number): Promise<string>;
}
