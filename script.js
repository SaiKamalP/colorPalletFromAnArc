function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
document.querySelector('#generate-btn').addEventListener('click',function(){
    generatePallet();
});
let palletNumber=1;
function generatePallet(){
   var hexCode=document.querySelector("#hex").value;
   const rgbFromHex=hexToRgb(hexCode);
   const hsvFromRgb=rgbToHsv(rgbFromHex.r,rgbFromHex.g,rgbFromHex.b);
   var is_greyScale=false;
   if(rgbFromHex.r==rgbFromHex.g && rgbFromHex.r==rgbFromHex.b){
    is_greyScale=true;
   }
    let divisionsCount=document.querySelector("#divisions").value;
    if(divisionsCount=="" || divisionsCount==0 || divisionsCount<3){
        divisionsCount=9;
    }
    divisionsCount++;
    const newPallet=document.createElement('div');
    newPallet.className="color-pallet-outer";
    let a=0;
    if(hsvFromRgb.s+hsvFromRgb.v-1==0){
        a=100;
    }
    else{
        a=(hsvFromRgb.s*hsvFromRgb.v)/(hsvFromRgb.s+hsvFromRgb.v-1);
    }
        
    for(var i=1;i<divisionsCount;i++){
        const c=(divisionsCount-i)/i;
        let sv=0;
        if(a>=0.9){
            sv= ((c+1)*a-Math.sqrt((c+1)*(c+1)*a*a -4*a*c))/(2*c);
        }
        else{
            sv= ((c+1)*a+Math.sqrt((c+1)*(c+1)*a*a -4*a*c))/(2*c);

        }
        const vv=c*sv;
        if(is_greyScale){
          sv=0;
        }
        const correspondingRGB=HSVtoRGB(hsvFromRgb.h,sv,vv);
        const newColor=document.createElement('div');
        newColor.className="color-block";
        newColor.style.background="rgb("+correspondingRGB.r+","+correspondingRGB.g+","+correspondingRGB.b+")";
        newPallet.appendChild(newColor);
    }
    newPallet.style.order=-palletNumber;
    const deletePalletBtn=document.createElement('div');
    deletePalletBtn.className="delete-pallet-outer";
    deletePalletBtn.innerHTML="x";
    newPallet.appendChild(deletePalletBtn);
    document.querySelector('.color-pallets-container').appendChild(newPallet);
    deletePalletBtn.addEventListener('click',function(){
      newPallet.remove();
    });
    palletNumber++;
}
function generateRectangleColorPallet(){
    let cnt=0;
    document.querySelectorAll('.color-block').forEach(block=>{
        const saturationValue=Math.floor(cnt%256)/255;
        const valueValue=1-Math.floor(cnt/256)/255;
        const correspondingRGB=HSVtoRGB(currentHue,saturationValue,valueValue);
        block.style.background="rgb("+correspondingRGB.r+","+correspondingRGB.g+","+correspondingRGB.b+")";
        cnt++;
    });
}

function hexToRgb(hex) {
    // Remove the hash symbol if it exists
    hex = hex.replace(/^#/, '');
  
    // Handle different formats based on the length of the input string
    let r, g, b, a;
  
    if (hex.length === 6) {
      // Format: RRGGBB
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else if (hex.length === 8) {
      // Format: RRGGBBAA
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
      a = parseInt(hex.substring(6, 8), 16) / 255; // Alpha channel
    } else if (hex.length === 3) {
      // Format: RGB
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 4) {
      // Format: RGBA
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
      a = parseInt(hex[3] + hex[3], 16) / 255; // Alpha channel
    } else {
      throw new Error('Invalid hex color format');
    }
  
    return {
      r: r,
      g: g,
      b: b,
      a: a !== undefined ? a : 1, // Default to fully opaque if alpha is not provided
    };
  }
  
  function rgbToHsv(r, g, b) {
    r = r / 255;
    g = g / 255;
    b = b / 255;
  
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    
    let h, s, v;
    
    // Calculate hue (H)
    if (delta === 0) {
      h = 0; // Achromatic (gray)
    } else if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    
    h = (h < 0) ? h + 6 : h; // Ensure hue is in the range [0, 6)
    h /= 6; // Scale hue to [0, 1]
  
    // Calculate saturation (S)
    s = (max === 0) ? 0 : delta / max;
  
    // Calculate value (V)
    v = max;
  
    return { h, s, v };
  }
  