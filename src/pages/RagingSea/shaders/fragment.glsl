
varying float vElevation;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
void main()
{
    float e = (vElevation+ uColorOffset) * uColorMultiplier;
   vec3 color = mix(uDepthColor,uSurfaceColor,e );
   gl_FragColor = vec4(color,1.0);
  
}