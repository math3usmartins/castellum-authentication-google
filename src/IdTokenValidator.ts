export interface IdTokenValidator {
	validate: (token: string, email: string) => Promise<void>
}
