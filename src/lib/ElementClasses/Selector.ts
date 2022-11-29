export interface ISelector {
    query(root: HTMLElement): HTMLElement[];
}

export class DefaultSelector implements ISelector {
    constructor(
        public queryString: string,
    ) { }

    query(root: HTMLElement): HTMLElement[] {
        return [...root.querySelectorAll(this.queryString)] as HTMLElement[];
    }
}

export class AspectRatioSelector extends DefaultSelector {
    constructor(
        public queryString: string,
        public aspectRatio: number,
    ) { super(queryString); }

    query(root: HTMLElement) {
        return super.query(root).filter(elem => {
            const { width, height } = elem.getBoundingClientRect();
            const computedAspectRatio = width / height;
            return (Math.abs(computedAspectRatio - this.aspectRatio) < 0.001);
        });
    }
}

export class HairpinSelector extends DefaultSelector {
    constructor(
        public queryString: string,
        public diminuendo: boolean,
    ) { super(queryString); }

    query(root: HTMLElement): HTMLElement[] {
        return super.query(root).filter(elem => {
            const drawString = elem.getAttribute("d") as string;
            const matches = drawString.match(/M[^L]+/gm)
            const isCreshendo = matches![0] !== matches![1];
            return (this.diminuendo && !isCreshendo) || (!this.diminuendo && isCreshendo);
        });
    }
}

export class InnerHTMLSelector extends DefaultSelector {
    constructor(
        public queryString: string,
        public innerHTML: string,
    ) { super(queryString); }

    query(root: HTMLElement): HTMLElement[] {
        return super.query(root).filter(elem => {
            const elemInnerHTML = elem.innerHTML as string;
            return elemInnerHTML === this.innerHTML;
        });
    }
}

export class TimeSigSelector extends DefaultSelector {
    constructor(
        public queryString: string,
        public n: number,
    ) { super(queryString); }

    query(root: HTMLElement): HTMLElement[] {
        return super.query(root).filter(elem => {
            const decimals = elem.parentElement!.getAttribute("data-name") as string;
            console.log(decimals.charAt([...elem.parentElement!.children].indexOf(elem)));
            return decimals.charAt([...elem.parentElement!.children].indexOf(elem)) === `${this.n}`;
        });
    }
}


export class RelativeWidthSelector extends DefaultSelector {
    constructor(
        public queryString: string,
        public relativeWidth: number,
    ) { super(queryString); }

    query(root: HTMLElement): HTMLElement[] {
        return super.query(root).filter(elem => {
            const relW = elem.getBoundingClientRect().width / root.getBoundingClientRect().width;
            console.log(relW);
            return Math.abs(relW - this.relativeWidth) < 0.001;
        });
    }

}

export type Selector =
    | DefaultSelector
    | HairpinSelector
    | AspectRatioSelector
    ;