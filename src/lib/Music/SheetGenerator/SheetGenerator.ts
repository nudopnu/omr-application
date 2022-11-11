import { KeySignature } from "../Sheet/KeySignature";
import { Sheet } from "../Sheet/Sheet";

export class SheetGenerator {

    static generateScaleSheet(): Sheet {
        const sheet = new Sheet();

        const sys = sheet.addSystem();
        const notes = new KeySignature('C', 'Ionian').toScale(5, 1);
        console.log(notes);
        
        sys.staffs[0].addNotes(notes);

        console.log(sheet);

        return sheet;
    }

}