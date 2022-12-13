export class Utils {
    static toDisplayName(s: string): string {
        return s.split("_").map(part => part.charAt(0) + part.slice(1).toLowerCase()).join(" ");
    }
}