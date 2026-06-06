// Three.js plasma sun — runs only if #hero-canvas exists.
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.z = 3.4;

  const noise = `
    vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
    vec4 mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
    vec4 permute(vec4 x){return mod289v4(((x*34.)+1.)*x);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
    float snoise(vec3 v){
      const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
      vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
      vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
      vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
      vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
      i=mod289v3(i);
      vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
      float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
      vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
      vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
      vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
      vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
      vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
      vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
      vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
      vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
      m=m*m;return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }`;

  const sunMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: noise + `
      varying vec3 vNormal; varying vec3 vPos; varying float vN;
      uniform float uTime;
      void main(){
        vNormal = normalize(normalMatrix * normal);
        float n = snoise(position * 2.2 + uTime * 0.22) * 0.14
                + snoise(position * 4.8 - uTime * 0.13) * 0.06
                + snoise(position * 9.5 + uTime * 0.08) * 0.025;
        vN = n;
        vec3 disp = position + normal * n;
        vPos = (modelViewMatrix * vec4(disp, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(disp, 1.0);
      }`,
    fragmentShader: noise + `
      varying vec3 vNormal; varying vec3 vPos; varying float vN;
      uniform float uTime;
      void main(){
        vec3 viewDir = normalize(-vPos);
        vec3 n = normalize(vNormal);
        float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 2.8);
        float surface = snoise(vNormal * 5.5  + uTime * 0.28) * 0.5 + 0.5;
        float fine    = snoise(vNormal * 14.0 - uTime * 0.45) * 0.5 + 0.5;
        float granule = snoise(vNormal * 28.0 + uTime * 0.15) * 0.5 + 0.5;
        float plasma   = surface * 0.55 + fine * 0.30 + granule * 0.15;
        float core     = mix(0.38, 0.82, plasma);
        float rim      = smoothstep(0.35, 1.0, fresnel);
        float brightness = mix(core, 1.0, rim * 0.9);
        float pulse    = 1.0 + sin(uTime * 0.55) * 0.04;
        brightness *= pulse;
        gl_FragColor = vec4(vec3(brightness * 0.96, brightness * 0.94, brightness * 0.92), 1.0);
      }`,
    transparent: false,
  });

  const sun = new THREE.Mesh(new THREE.SphereGeometry(1.0, 256, 256), sunMat);
  scene.add(sun);

  function resize() {
    const w = canvas.parentElement.offsetWidth;
    const h = canvas.parentElement.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  let mx = 0, my = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 0.22;
    my = (e.clientY / window.innerHeight - 0.5) * 0.22;
  }, { passive: true });

  const clock = new THREE.Clock();
  (function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    tx += (mx - tx) * 0.04;
    ty += (my - ty) * 0.04;
    sunMat.uniforms.uTime.value = t;
    sun.rotation.y = t * 0.06 + tx;
    sun.rotation.x = ty * 0.5;
    renderer.render(scene, camera);
  })();
})();
