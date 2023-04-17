export default function capitalizeWord(name: string) {
	return name.replace(/\b(\w)/g, (s: string) => s.toUpperCase());
}