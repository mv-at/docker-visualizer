"use client";

import React, {MouseEventHandler, ReactNode, useEffect} from 'react';
import '../styles/glowingCard.css';

const GlowingCard = (props: {
    children?: ReactNode|ReactNode[],
    background?: string,
    shadow?: string,
    border?: string,
    borderRadius?: number,
    borderWidth?: number,
    hueSpeed?: number,
    animationSpeed?: number,
    interactionSpeed?: number,
}) => {

    const [hue, setHue] = React.useState(0);
    const [saturation, setSaturation] = React.useState(100);
    const [visible, setVisible] = React.useState(false);

    const rgbToHsl = (r: number, g: number, b: number) => {
        r /= 255;
        g /= 255;
        b /= 255;

        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max == min)
            h = s = 0; // achromatic
        else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            if (h)
                h /= 6;
        }
        return [ h || 0, s, l ];
    }

    const hexToRgb = (hex: string) => {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : undefined;
    }

    useEffect(() => {
        let rgb = hexToRgb(props.border || '#000');
        if (rgb) {
            let hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
            setHue(hsl[0] * 360);
            setSaturation(hsl[1] * 100);
        }
        setVisible(true)
    }, [props.border]);

    const [mousePos, setMousePos] = React.useState({x: 0, y: 0});

    const handleMouseMove = (e: any) => {
        const rect = (e.target as HTMLSpanElement).getBoundingClientRect();
        let x = ((e.clientX - rect.left) / rect.width) * 100;
        let y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({x, y});
    }

    return (
        <div className='glowing-card relative' onMouseLeave={handleMouseMove} style={{
            "--glowingcard-bg": props.background || '#000',
            "--glowingcard-shadow": props.shadow || '#000',
            "--glowingcard-border-radius": props.borderRadius !== undefined ? (props.borderRadius + 'px') : '3vw',
            "--glowingcard-border-width": props.borderWidth !== undefined ? (props.borderWidth + 'px') : '5px',
            "--glowingcard-hue": hue,
            "--glowingcard-saturation": saturation,
            "--glowingcard-hue-speed": props.hueSpeed !== undefined ? props.hueSpeed : 1,
            "--glowingcard-animation-speed": props.animationSpeed !== undefined ? props.animationSpeed + 's' : '8s',
            "--glowingcard-interaction-speed": props.interactionSpeed !== undefined ? props.interactionSpeed + 's' : '1s',
            "--glowingcard-bg-x": mousePos.x,
            "--glowingcard-bg-y": mousePos.y,
            "visibility": visible ? 'visible' : 'hidden',
        } as React.CSSProperties}>
            <span className='absolute -inset-2' onMouseEnter={handleMouseMove}/>
            <span className='glow'/>
            <div className='inner text-white'>
                {props.children}
            </div>
        </div>
    );
};

export default GlowingCard;