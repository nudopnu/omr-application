import React from 'react'

export function SvgFilter() {

    const scale = 5;
    const frequency = 0.05;

    return (
        <svg>
            {/* Taken from https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDisplacementMap */}
            <filter id="displacementFilter">
                <feTurbulence type="turbulence" baseFrequency={frequency} numOctaves="2" result="turbulence"></feTurbulence>
                <feDisplacementMap in2="turbulence" in="SourceGraphic" scale={scale} xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
            </filter>
            <filter id="erode">
                <feMorphology operator="erode" radius="2" />
            </filter>
            <filter id="dilate">
                <feMorphology operator="dilate" radius="1" />
            </filter>
            {/* Created with https://fffuel.co/nnnoise/ */}
            <filter id="noise" >
                <feTurbulence type="turbulence" baseFrequency="0.15" numOctaves="14" seed="15" result="turbulence"></feTurbulence>
                <feSpecularLighting surfaceScale="15" specularConstant="1" specularExponent="200" lightingColor="hsl(23, 0%, 100%)" in="turbulence" result="specularLighting">
                    <feDistantLight azimuth="3" elevation="100"></feDistantLight>
                </feSpecularLighting>

                {/* Taken from https://stackoverflow.com/questions/17873715/how-to-invert-a-white-image-to-black-using-svg-filters/17930908#17930908 */}
                <feColorMatrix in="specularLighting" type="matrix" result="inverted" values="-1 0 0 0 1 
                                                              0 -1 0 0 1 
                                                              0 0 -1 0 1
                                                              0 0 0 1 0"/>
                {/* Taken from https://stackoverflow.com/questions/31010115/create-static-png-from-svg-without-anti-aliasing-with-or-without-canvas/37897818#37897818 */}
                <feComponentTransfer>
                    <feFuncA type="discrete" tableValues="0 1" />
                </feComponentTransfer>
                <feMorphology operator="dilate" radius="1" />
                <feMorphology operator="erode" radius="1" />

            </filter>
            <filter>
                <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" seed="15" stitchTiles="stitch" x="0%" y="0%" width="100%" height="100%" result="turbulence"></feTurbulence>
                <feSpecularLighting surfaceScale="15" specularConstant="0.75" specularExponent="20" lightingColor="hsl(23, 0%, 100%)" x="0%" y="0%" width="100%" height="100%" in="turbulence" result="specularLighting">
                    <feDistantLight azimuth="3" elevation="1"></feDistantLight>
                </feSpecularLighting>
            </filter>

            {/* Taken from https://tympanus.net/codrops/2019/02/19/svg-filter-effects-creating-texture-with-feturbulence/ */}
            <filter id='paper' x='0%' y='0%' width='100%' height="100%">
                <feTurbulence type="fractalNoise" baseFrequency='0.04' result='noise' numOctaves="5" />
                <feDiffuseLighting in='noise' lighting-color='white' surfaceScale='1'>
                    <feDistantLight azimuth='45' elevation='60' />
                </feDiffuseLighting>
            </filter>
            <rect width="700" height="700" fill="hsl(23, 100%, 54%)" filter="url(#nnnoise-filter)"></rect>
        </svg>
    );
}