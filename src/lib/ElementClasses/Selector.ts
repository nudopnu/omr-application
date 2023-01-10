export interface ISelector {
    query(root: HTMLElement): HTMLElement[];
}

export class DefaultSelector implements ISelector {
    constructor(
        public className: string,
        public queryString: string,
    ) { }

    queryClass(root): HTMLElement[] {
        return [...root.querySelectorAll(`.${this.className}`)] as HTMLElement[];
    }

    query(root: HTMLElement, filter = (elem, idx?) => true): HTMLElement[] {
        return [...new Set([
            ...[...root.querySelectorAll(this.queryString)].filter(filter),
            ...this.queryClass(root),
        ])] as HTMLElement[];
    }
}

export class AspectRatioSelector extends DefaultSelector {
    constructor(
        public className: string,
        public queryString: string,
        public aspectRatio: number,
    ) { super(className, queryString); }

    query(root: HTMLElement) {
        return super.query(root, elem => {
            const { width, height } = elem.getBoundingClientRect();
            const computedAspectRatio = width / height;
            return (Math.abs(computedAspectRatio - this.aspectRatio) < 0.001);
        });
    }
}

export class HairpinSelector extends DefaultSelector {
    constructor(
        public className: string,
        public queryString: string,
        public diminuendo: boolean,
    ) { super(className, queryString); }

    query(root: HTMLElement): HTMLElement[] {
        return super.query(root, elem => {
            const drawString = elem.getAttribute("d") as string;
            const matches = drawString.match(/M[^L]+/gm)
            const isCreshendo = matches![0] !== matches![1];
            return (this.diminuendo && !isCreshendo) || (!this.diminuendo && isCreshendo);
        });
    }
}

export class InnerHTMLSelector extends DefaultSelector {
    constructor(
        public className: string,
        public queryString: string,
        public innerHTML: string,
    ) { super(className, queryString); }

    query(root: HTMLElement): HTMLElement[] {
        return super.query(root, elem => {
            const elemInnerHTML = elem.innerHTML as string;
            return elemInnerHTML === this.innerHTML;
        });
    }
}

export class TimeSigSelector extends DefaultSelector {
    constructor(
        public className: string,
        public queryString: string,
        public n: number,
    ) { super(className, queryString); }

    query(root: HTMLElement): HTMLElement[] {
        return super.query(root, elem => {
            if (elem.hasAttribute("data-name")) {
                const decimals = elem.getAttribute("data-name") as string;
                return decimals === `${this.n}`;
            } else {
                const decimals = elem.parentElement!.getAttribute("data-name") as string
                return decimals.charAt([...elem.parentElement!.children].indexOf(elem)) === `${this.n}`;
            }
        });
    }
}


export class RelativeWidthSelector extends DefaultSelector {
    constructor(
        public className: string,
        public queryString: string,
        public relativeWidth: number,
    ) { super(className, queryString); }

    query(root: HTMLElement): HTMLElement[] {
        return super.query(root, elem => {
            const relW = elem.getBoundingClientRect().width / root.getBoundingClientRect().width;
            return Math.abs(relW - this.relativeWidth) < 0.001;
        });
    }

}

export type Selector =
    | DefaultSelector
    | HairpinSelector
    | AspectRatioSelector
    ;