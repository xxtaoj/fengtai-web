import { useState, type ImgHTMLAttributes } from 'react';
export function LocalImage({className='',...props}:ImgHTMLAttributes<HTMLImageElement>){const[failed,setFailed]=useState(false);if(failed)return <div className={`media-placeholder min-h-48 ${className}`} role="img" aria-label={props.alt}/>;return <img {...props} className={className} onError={()=>setFailed(true)}/>}
