import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop(){
  const {pathname,hash}=useLocation();
  useEffect(()=>{
    if(!hash){window.scrollTo({top:0,left:0,behavior:'instant'});return}
    const frame=requestAnimationFrame(()=>{
      document.getElementById(hash.slice(1))?.scrollIntoView({behavior:'smooth',block:'start'});
    });
    return()=>cancelAnimationFrame(frame);
  },[pathname,hash]);
  return null;
}
