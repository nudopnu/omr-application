export interface Layer {
    readonly type: string;
};

export class ImageLayer implements Layer {
    readonly type: string = 'base64ImageUrl';
    src: string = "";
}

export type LayerUT =
    ImageLayer;