
import {Vector3} from "./types"

export const VISIBLE_WV_MIN = 380;
export const VISIBLE_WV_MAX = 780;

/**
 * Convert a wavelength in the visible light spectrum to a RGB color value that is suitable to be displayed on a
 * monitor
 *
 * @param wavelength wavelength in nm
 * @return RGB color encoded in int. each color is represented with 8 bits and has a layout of
 * 00000000RRRRRRRRGGGGGGGGBBBBBBBB where MSB is at the leftmost
 */
export function wv2rgb(wavelength : number){
  const xyz : Vector3 = cie1931WavelengthToXYZFit(wavelength);
  const rgb : Vector3 = srgbXYZ2RGB(xyz);

  var c = 0;
  c |= (((rgb[0] * 0xFF)) & 0xFF) << 16;
  c |= (((rgb[1] * 0xFF)) & 0xFF) << 8;
  c |= (((rgb[2] * 0xFF)) & 0xFF) << 0;

  return c;
}

/**
* Convert XYZ to RGB in the sRGB color space
* <p>
* The conversion matrix and color component transfer function is taken from http://www.color.org/srgb.pdf, which
* follows the International Electrotechnical Commission standard IEC 61966-2-1 "Multimedia systems and equipment -
* Colour measurement and management - Part 2-1: Colour management - Default RGB colour space - sRGB"
*
* @param xyz XYZ values in a double array in the order of X, Y, Z. each value in the range of [0.0, 1.0]
* @return RGB values in a double array, in the order of R, G, B. each value in the range of [0.0, 1.0]
*/
function srgbXYZ2RGB(xyz : Vector3) : Vector3 {
  const [x, y, z] = xyz;
  

  const rl =  3.2406255 * x + -1.537208  * y + -0.4986286 * z;
  const gl = -0.9689307 * x +  1.8757561 * y +  0.0415175 * z;
  const bl =  0.0557101 * x + -0.2040211 * y +  1.0569959 * z;

  return [
          srgbXYZ2RGBPostprocess(rl),
          srgbXYZ2RGBPostprocess(gl),
          srgbXYZ2RGBPostprocess(bl)
  ];
}

/**
* helper function for {@link #srgbXYZ2RGB(double[])}
*/
function srgbXYZ2RGBPostprocess(c : number) {
  // clip if c is out of range
  c = c > 1 ? 1 : (c < 0 ? 0 : c);

  // apply the color component transfer function
  c = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1. / 2.4) - 0.055;

  return c;
}

/**
* A multi-lobe, piecewise Gaussian fit of CIE 1931 XYZ Color Matching Functions by Wyman el al. from Nvidia. The
* code here is adopted from the Listing 1 of the paper authored by Wyman et al.
* <p>
* Reference: Chris Wyman, Peter-Pike Sloan, and Peter Shirley, Simple Analytic Approximations to the CIE XYZ Color
* Matching Functions, Journal of Computer Graphics Techniques (JCGT), vol. 2, no. 2, 1-11, 2013.
*
* @param wavelength wavelength in nm
* @return XYZ in a double array in the order of X, Y, Z. each value in the range of [0.0, 1.0]
*/
function cie1931WavelengthToXYZFit(wavelength : number) : Vector3 {
  const wave = wavelength;
  let t1, t2, t3;

  t1 = (wave - 442.0) * ((wave < 442.0) ? 0.0624 : 0.0374);
  t2 = (wave - 599.8) * ((wave < 599.8) ? 0.0264 : 0.0323);
  t3 = (wave - 501.1) * ((wave < 501.1) ? 0.0490 : 0.0382);

  const x =   0.362 * Math.exp(-0.5 * t1 * t1)
          + 1.056 * Math.exp(-0.5 * t2 * t2)
          - 0.065 * Math.exp(-0.5 * t3 * t3);
  

  t1 = (wave - 568.8) * ((wave < 568.8) ? 0.0213 : 0.0247);
  t2 = (wave - 530.9) * ((wave < 530.9) ? 0.0613 : 0.0322);

  const y =   0.821 * Math.exp(-0.5 * t1 * t1)
      + 0.286 * Math.exp(-0.5 * t2 * t2);

  t1 = (wave - 437.0) * ((wave < 437.0) ? 0.0845 : 0.0278);
  t2 = (wave - 459.0) * ((wave < 459.0) ? 0.0385 : 0.0725);

  const z =   1.217 * Math.exp(-0.5 * t1 * t1)
      + 0.681 * Math.exp(-0.5 * t2 * t2);

  return [ x, y, z ];
}