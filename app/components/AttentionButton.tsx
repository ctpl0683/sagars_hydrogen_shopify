import { Link } from '@remix-run/react';
import React from 'react';

interface AttentionButtonColScheme {
    btnPrimeColor   ?: string;
    btnOnShadowColor    ?: string;
    btnTxtColor     ?: string;
    iconBg          ?: string;
    iconColor       ?: string;
}

const AttentionButton = ({ btnTxt, btnHref, size, colorTheme, cls, children }: { btnTxt:string, btnHref: string, size?:string, colorTheme?:AttentionButtonColScheme, cls?:string, children?:any }) => {

    const btnBoxShadowInset = { boxShadow: `inset 0 0 1.6em -0.6em ${colorTheme?.btnOnShadowColor??'#714da6'};` }
    const iconBoxShadowInset = { boxShadow: `0.1em 0.1em 0.6em 0.2em ${colorTheme?.iconColor??'#7b52b9'};` }
 

    return (
        <Link
            to={btnHref} 
            className={`AttentionButton-io-button 
            ${colorTheme?.btnPrimeColor ? `bg-[${colorTheme?.btnPrimeColor}]` : ''} 
            ${colorTheme?.btnTxtColor  ? `text-[${colorTheme?.btnTxtColor}]` : ''}
            ${cls}`} 
            style={{...btnBoxShadowInset, fontSize: `${size??'17px'}`}}>
            {btnTxt}
            <div className={`AttentionButton-io-button-icon
                ${colorTheme?.iconBg ? `bg-[${colorTheme?.iconBg}]` : ''} 
                ${colorTheme?.iconColor  ? `text-[${colorTheme?.iconColor}]` : ''}`} 
                style={{...iconBoxShadowInset}}>
                    {
                        children
                    }
                {/* <svg
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path
                        d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                        fill="currentColor"
                    ></path>
                </svg> */}
            </div>
        </Link>

    );
}

export default AttentionButton;
