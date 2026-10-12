"use strict";
(self.webpackChunkgohary = self.webpackChunkgohary || []).push([
    [347], {
        3498(e, n, t) {
            t.d(n, {
                createHeroBrainDirector: () => j
            });
            var a = t(3437),
                o = t(2708),
                i = t(5724),
                r = t(4575),
                l = t(3409),
                s = t(5061),
                u = t(1435);
            const c = t.p + "static/media/brain-gohary.1b697a25a9e4ba665bf3.glb",
                d = "low",
                m = "medium",
                f = "high",
                h = {
                    [d]: {
                        maxPixelRatio: 1,
                        particles: 320,
                        paths: 18,
                        impulseSamples: 34,
                        nebula: 3,
                        ambientInterval: 1 / 24,
                        bloom: {
                            strength: .85,
                            radius: .18,
                            threshold: 1,
                            resolutionScale: .5
                        }
                    },
                    [m]: {
                        maxPixelRatio: 1.25,
                        particles: 620,
                        paths: 26,
                        impulseSamples: 48,
                        nebula: 4,
                        ambientInterval: 1 / 30,
                        bloom: {
                            strength: .95,
                            radius: .2,
                            threshold: 1,
                            resolutionScale: .6
                        }
                    },
                    [f]: {
                        maxPixelRatio: 1.5,
                        particles: 1100,
                        paths: 40,
                        impulseSamples: 64,
                        nebula: 5,
                        ambientInterval: 0,
                        bloom: {
                            strength: .8,
                            radius: .25,
                            threshold: 1,
                            resolutionScale: .75
                        }
                    }
                },
                v = e => h[e] || h[m],
                p = 0,
                g = 4152371,
                w = 10273356,
                b = 14870405,
                S = 16032576,
                y = 16640721,
                x = 4152371,
                M = {
                    x: -Math.PI / 2,
                    y: 0,
                    z: 0
                },
                C = new a.Pq0(0, -.06, -.13),
                P = e => {
                    const n = e.root.clone(!0);
                    let t = null;
                    n.traverse(e => {
                        e.isMesh && !t && (t = e)
                    });
                    const o = new a.BKk({
                        vertexShader: "\n    attribute vec4 color;\n\n    uniform mat4 uMeshToBrain;\n    uniform float uScatter;\n    uniform float uTime;\n\n    varying vec3 vBrainPos;\n    varying vec3 vNormalView;\n    varying vec3 vViewDir;\n    varying vec4 vAnatomy;\n    varying float vScatterFade;\n\n    /**\n     * Per-vertex dispersal seed, in [0,1] and provably finite.\n     *\n     * Written as bounded sines rather than the usual multiply-and-fract hash on\n     * purpose. That hash returned NaN for some vertices at this mesh's input\n     * magnitudes, and a NaN seed is fatal rather than merely ugly: it makes the\n     * travel term NaN through 0 * NaN, and a NaN vertex position shatters the\n     * whole mesh into spikes even while the scatter uniform reads exactly zero.\n     * sin() of a bounded argument cannot do that.\n     *\n     * Layering two frequencies keeps neighbouring vertices from drifting in\n     * lockstep, which is what makes the dispersal read as organic.\n     */\n    float vertexSeed(vec3 p) {\n        float a = dot(p, vec3(12.9898, 78.233, 37.719));\n        float b = dot(p, vec3(37.117, 11.703, 61.331));\n        return 0.5 + 0.5 * sin(a * 7.13 + sin(b * 3.71) * 2.0);\n    }\n\n    void main() {\n        vAnatomy = color;\n\n        // Brain-space position, used by the fragment shader for its distance to\n        // the ignition core.\n        vBrainPos = (uMeshToBrain * vec4(position, 1.0)).xyz;\n\n        // Dispersal, not detonation: each vertex drifts outward along its own\n        // radial direction with a slow organic wander layered on top, so the\n        // shell opens up into a field instead of bursting into debris.\n        //\n        // Done in mesh space directly. Round-tripping through uMeshToBrain and\n        // its inverse to displace in brain space bought nothing \u2014 the mesh is\n        // centred, so the radial direction is the same either way \u2014 and made the\n        // vertex position depend on a matrix pair that has to agree exactly.\n        //\n        // Branchless as well: at uScatter 0 every term below is exactly zero, so\n        // this is the identity transform rather than a guarded special case.\n        float scatter = clamp(uScatter, 0.0, 3.0);\n        float seed = vertexSeed(position);\n        float lag = 0.55 + 0.45 * seed;\n        float travel = scatter * lag;\n\n        vec3 radial = normalize(position + vec3(0.0001));\n        vec3 wander = vec3(\n            sin(uTime * 0.21 + seed * 34.0),\n            sin(uTime * 0.17 + seed * 51.0),\n            sin(uTime * 0.13 + seed * 27.0)\n        );\n\n        vec3 displaced = position\n            + radial * travel * (1.1 + seed * 1.6)\n            + wander * travel * 0.16;\n\n        // Individual fragments dim as they leave, so the field thins out rather\n        // than staying a constant-density cloud at a larger radius.\n        vScatterFade = 1.0 - scatter * 0.72;\n\n        vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);\n        vNormalView = normalize(normalMatrix * normal);\n        vViewDir = normalize(-mvPosition.xyz);\n\n        gl_Position = projectionMatrix * mvPosition;\n    }\n",
                        fragmentShader: "\n    precision highp float;\n\n    uniform vec3 uDeepColor;\n    uniform vec3 uFoldColor;\n    uniform vec3 uHotColor;\n    uniform vec3 uCorePosition;\n\n    uniform float uTime;\n    uniform float uOpacity;\n    uniform float uFoldIntensity;\n    uniform float uBaseIntensity;\n    uniform float uRimIntensity;\n    uniform float uCoreEnergy;\n    uniform float uActivity;\n    uniform float uInkMix;\n    uniform vec3 uInkColor;\n    uniform vec2 uSafeCenter;\n    uniform float uSafeRadius;\n    uniform float uSafeStrength;\n    uniform vec2 uResolution;\n\n    varying vec3 vBrainPos;\n    varying vec3 vNormalView;\n    varying vec3 vViewDir;\n    varying vec4 vAnatomy;\n    varying float vScatterFade;\n\n    void main() {\n        float creaseMask = vAnatomy.b;\n        float sulcus = vAnatomy.r;\n        float buried = vAnatomy.a;\n\n        // The lit web is the sulcal line itself: take the deep end of the signed\n        // curvature, not every curved triangle, or the cortex fills in solid.\n        float fold = smoothstep(0.70, 0.99, sulcus) * smoothstep(0.35, 0.80, creaseMask);\n        fold = pow(fold, 1.6);\n\n        // Gyral crests catch a little extra light, the way a lit ridge does.\n        float crest = 1.0 - smoothstep(0.06, 0.30, sulcus);\n\n        // abs() so back faces rim correctly under DoubleSide.\n        float fresnel = pow(1.0 - abs(dot(normalize(vNormalView), normalize(vViewDir))), 2.6);\n\n        float distanceToCore = length(vBrainPos - uCorePosition);\n        float ignition = exp(-distanceToCore * distanceToCore * 24.0) * uCoreEnergy;\n\n        // A slow spherical wash leaving the core keeps the mesh visually tied to\n        // the impulses travelling over it.\n        float wash = 0.5 + 0.5 * sin(distanceToCore * 6.5 - uTime * 1.15);\n\n        float energy =\n            fold * uFoldIntensity * (0.62 + 0.38 * wash) * (0.55 + 0.45 * uActivity)\n            + crest * 0.12 * uFoldIntensity\n            + fresnel * uRimIntensity;\n\n        float base = uBaseIntensity * (0.32 + 0.68 * (1.0 - buried));\n\n        vec3 lineColor = mix(uFoldColor, uHotColor, clamp(ignition, 0.0, 1.0));\n\n        vec3 color =\n            uDeepColor * base\n            + lineColor * energy\n            + uHotColor * ignition * (0.30 + fold * 0.9);\n\n        // Screen-space content-safe zone: the ambient field stays richest at the\n        // edges of the viewport and thins out behind the column where headings,\n        // cards and CTAs live.\n        float safe = 1.0;\n        if (uSafeStrength > 0.0) {\n            vec2 uv = gl_FragCoord.xy / uResolution;\n            float d = length((uv - uSafeCenter) / vec2(1.0, 0.72));\n            safe = mix(1.0, smoothstep(uSafeRadius * 0.45, uSafeRadius, d), uSafeStrength);\n        }\n\n        float amount = uOpacity * vScatterFade * safe;\n\n        vec3 glow = color * amount;\n        float glowAlpha = clamp(max(glow.r, max(glow.g, glow.b)), 0.0, 1.0);\n        float inkAlpha = clamp((energy + base * 0.6 + ignition) * 1.6 * amount, 0.0, 1.0);\n\n        gl_FragColor = mix(\n            vec4(glow, glowAlpha),\n            vec4(uInkColor * inkAlpha, inkAlpha),\n            uInkMix\n        );\n    }\n",
                        uniforms: {
                            uMeshToBrain: {
                                value: new a.kn4
                            },
                            uDeepColor: {
                                value: new a.Q1f(g)
                            },
                            uFoldColor: {
                                value: new a.Q1f(w)
                            },
                            uHotColor: {
                                value: new a.Q1f(S)
                            },
                            uCorePosition: {
                                value: C.clone()
                            },
                            uTime: {
                                value: 0
                            },
                            uOpacity: {
                                value: 0
                            },
                            uFoldIntensity: {
                                value: .6
                            },
                            uBaseIntensity: {
                                value: .045
                            },
                            uRimIntensity: {
                                value: .09
                            },
                            uCoreEnergy: {
                                value: 0
                            },
                            uActivity: {
                                value: 0
                            },
                            uScatter: {
                                value: 0
                            },
                            uInkMix: {
                                value: 0
                            },
                            uInkColor: {
                                value: new a.Q1f(x)
                            },
                            uSafeCenter: {
                                value: new a.I9Y(.5, .5)
                            },
                            uSafeRadius: {
                                value: .62
                            },
                            uSafeStrength: {
                                value: 0
                            },
                            uResolution: {
                                value: new a.I9Y(1, 1)
                            }
                        },
                        transparent: !0,
                        blending: a.bCz,
                        blendSrc: a.qad,
                        blendDst: a.OuU,
                        blendSrcAlpha: a.qad,
                        blendDstAlpha: a.OuU,
                        depthWrite: !1,
                        depthTest: !0,
                        side: a.$EB
                    });
                    return o.uniforms.uMeshToBrain.value.copy(e.meshToBrain), t.material = o, t.frustumCulled = !1, {
                        root: n,
                        mesh: t,
                        material: o,
                        surface: e.surface
                    }
                };
            let A = null;
            const k = () => {
                    var e;
                    return A || (A = new Promise((n, t) => {
                        const o = new s.B(e);
                        o.setMeshoptDecoder(u.f), o.load(c, e => {
                            let o = null;
                            if (e.scene.traverse(e => {
                                    e.isMesh && !o && (o = e)
                                }), !o) return void t(new Error("brain model contains no mesh"));
                            o.frustumCulled = !1, e.scene.updateMatrixWorld(!0);
                            const i = o.matrixWorld.clone(),
                                r = o.geometry.getAttribute("position"),
                                l = o.geometry.getAttribute("normal"),
                                s = o.geometry.getAttribute("color"),
                                u = r.count,
                                c = new Float32Array(3 * u),
                                d = new Float32Array(3 * u),
                                m = new Float32Array(u),
                                f = (new a.dwI).getNormalMatrix(i),
                                h = new a.Pq0;
                            for (let n = 0; n < u; n++) h.fromBufferAttribute(r, n).applyMatrix4(i), c[3 * n] = h.x, c[3 * n + 1] = h.y, c[3 * n + 2] = h.z, h.fromBufferAttribute(l, n).applyMatrix3(f).normalize(), d[3 * n] = h.x, d[3 * n + 1] = h.y, d[3 * n + 2] = h.z, m[n] = s ? s.getZ(n) : .5;
                            n({
                                root: e.scene,
                                mesh: o,
                                meshToBrain: i,
                                surface: {
                                    positions: c,
                                    normals: d,
                                    fold: m,
                                    count: u
                                }
                            })
                        }, void 0, t)
                    }).catch(e => {
                        throw A = null, e
                    })), A
                },
                I = [new a.Pq0(0, .05, 3.15), new a.Pq0(.14, .02, 2.68), new a.Pq0(.48, -.06, 1.95), new a.Pq0(.8, -.13, 1.3), new a.Pq0(.92, -.18, .86), new a.Pq0(.78, -.2, .5)],
                T = [new a.Pq0(0, 0, 0), new a.Pq0(.02, -.01, 0), new a.Pq0(.12, -.05, .04), new a.Pq0(.3, -.1, .12), new a.Pq0(.44, -.13, .2), new a.Pq0(.52, -.14, .26)],
                z = {
                    compact: {
                        anchor: [.5, .2],
                        distance: 3.95,
                        tilt: .04
                    },
                    medium: {
                        anchor: [.38, .42],
                        distance: 3.9,
                        tilt: .04
                    },
                    wide: {
                        anchor: [.34, .44],
                        distance: 3.5,
                        tilt: .03
                    }
                },
                F = e => {
                    const n = new a.B6O(I, !1, "catmullrom", .35),
                        t = new a.B6O(T, !1, "catmullrom", .35),
                        o = new a.Pq0,
                        i = new a.Pq0,
                        r = new a.Pq0,
                        l = new a.Pq0,
                        s = new a.Pq0;
                    let u = 1,
                        c = 1,
                        d = "wide";
                    const m = {
                        setViewport(n, t) {
                            c = n / Math.max(1, t), u = c < 1 ? Math.min(2.1, 1.2 / Math.max(c, .42)) : 1.2, e.fov = c < 1 ? 52 : 46, e.aspect = c, e.updateProjectionMatrix(), d = n < 768 ? "compact" : n < 1280 ? "medium" : "wide"
                        },
                        bootPose(e, a, o) {
                            const i = Math.min(1, Math.max(0, e));
                            n.getPoint(i, a), t.getPoint(i, o), r.subVectors(a, o).multiplyScalar(u), a.copy(o).add(r)
                        },
                        heroPose(n, t) {
                            ((n, t, a) => {
                                const o = n.distance * u,
                                    i = Math.tan(e.fov * Math.PI / 360) * o,
                                    r = i * c,
                                    l = (1 - 2 * n.anchor[0]) * r,
                                    s = (2 * n.anchor[1] - 1) * i;
                                a.set(l, s, 0), t.set(l, s + n.tilt * o, o)
                            })(z[d], n, t)
                        },
                        blend(e, n, t, a, o, i) {
                            l.copy(e).lerp(t, o), s.copy(n).lerp(a, o), m.commit(l, s, i)
                        },
                        commit(n, t, a) {
                            o.copy(n), i.copy(t), a && (o.x += a.x, o.y += a.y), e.position.copy(o), e.lookAt(i)
                        }
                    };
                    return m
                },
                q = [{
                    scale: .11,
                    spikes: 1,
                    softness: 2.6,
                    gain: 1.5
                }, {
                    scale: .34,
                    spikes: .6,
                    softness: 2.1,
                    gain: .32
                }, {
                    scale: .85,
                    spikes: 0,
                    softness: 1.8,
                    gain: .09
                }],
                O = (e, n, t, o) => {
                    const {
                        positions: i,
                        normals: r
                    } = e, l = new a.Pq0(i[3 * t], i[3 * t + 1], i[3 * t + 2]), s = new a.Pq0(r[3 * t], r[3 * t + 1], r[3 * t + 2]), u = new a.Pq0(o() - .5, o() - .5, o() - .5);
                    u.addScaledVector(s, -u.dot(s)), u.lengthSq() < 1e-6 && u.set(s.z, s.x, s.y), u.normalize();
                    const c = .09 + .07 * o(),
                        d = [l.clone().addScaledVector(s, .012)],
                        m = new a.Pq0,
                        f = new a.Pq0;
                    for (let h = 0; h < 7; h++) {
                        u.add(new a.Pq0(o() - .5, o() - .5, o() - .5).multiplyScalar(.22)).normalize(), m.copy(l).addScaledVector(u, c);
                        const e = n.nearest(m.x, m.y, m.z);
                        if (e < 0) break;
                        const t = i[3 * e] - l.x,
                            h = i[3 * e + 1] - l.y,
                            v = i[3 * e + 2] - l.z;
                        if (t * t + h * h + v * v > c * c * 3.2) break;
                        if (l.set(i[3 * e], i[3 * e + 1], i[3 * e + 2]), f.set(r[3 * e], r[3 * e + 1], r[3 * e + 2]), u.addScaledVector(f, -u.dot(f)), u.lengthSq() < 1e-6) break;
                        u.normalize(), s.copy(f), d.push(l.clone().addScaledVector(s, .012))
                    }
                    return d.length >= 3 ? d : null
                },
                R = (e, n, t) => {
                    const o = ((e, n) => {
                            const {
                                positions: t,
                                count: a
                            } = e, o = new Map, i = (e, t, a) => "".concat(Math.floor(e / n), "|").concat(Math.floor(t / n), "|").concat(Math.floor(a / n));
                            for (let r = 0; r < a; r++) {
                                const e = i(t[3 * r], t[3 * r + 1], t[3 * r + 2]),
                                    n = o.get(e);
                                n ? n.push(r) : o.set(e, [r])
                            }
                            return {
                                nearest: (e, a, i) => {
                                    const r = Math.floor(e / n),
                                        l = Math.floor(a / n),
                                        s = Math.floor(i / n);
                                    let u = -1,
                                        c = 1 / 0;
                                    for (let n = 1; n <= 3 && u < 0; n++)
                                        for (let d = -n; d <= n; d++)
                                            for (let m = -n; m <= n; m++)
                                                for (let f = -n; f <= n; f++) {
                                                    const n = o.get("".concat(r + d, "|").concat(l + m, "|").concat(s + f));
                                                    if (n)
                                                        for (let o = 0; o < n.length; o++) {
                                                            const r = n[o],
                                                                l = t[3 * r] - e,
                                                                s = t[3 * r + 1] - a,
                                                                d = t[3 * r + 2] - i,
                                                                m = l * l + s * s + d * d;
                                                            m < c && (c = m, u = r)
                                                        }
                                                }
                                    return u
                                }
                            }
                        })(e, .05),
                        {
                            fold: i,
                            count: r
                        } = e,
                        l = [];
                    let s = 0;
                    for (; l.length < n.paths && s < 40 * n.paths;) {
                        s++;
                        const n = Math.floor(t() * r);
                        if (i[n] < .45 && t() > .2) continue;
                        const u = O(e, o, n, t);
                        u && l.push(new a.B6O(u, !1, "catmullrom", .4))
                    }
                    const u = l.length,
                        c = n.impulseSamples,
                        d = 47 * u,
                        m = new Float32Array(2 * d * 3),
                        f = new Float32Array(2 * d),
                        h = new Float32Array(2 * d),
                        v = u * c,
                        p = new Float32Array(3 * v),
                        g = new Float32Array(v),
                        w = new Float32Array(v),
                        y = new Float32Array(v),
                        M = new Float32Array(v),
                        C = new Float32Array(v);
                    let P = 0,
                        A = 0;
                    for (let a = 0; a < u; a++) {
                        const e = l[a],
                            n = e.getSpacedPoints(47);
                        for (let t = 0; t < 47; t++) {
                            const e = n[t],
                                o = n[t + 1],
                                i = t / 47,
                                r = (t + 1) / 47;
                            m[3 * P] = e.x, m[3 * P + 1] = e.y, m[3 * P + 2] = e.z, f[P] = a / u, h[P] = Math.sin(i * Math.PI), P++, m[3 * P] = o.x, m[3 * P + 1] = o.y, m[3 * P + 2] = o.z, f[P] = a / u, h[P] = Math.sin(r * Math.PI), P++
                        }
                        const o = e.getSpacedPoints(c - 1),
                            i = t(),
                            r = .16 + .34 * t(),
                            s = t() * t();
                        for (let a = 0; a < c; a++) {
                            const e = o[a];
                            p[3 * A] = e.x, p[3 * A + 1] = e.y, p[3 * A + 2] = e.z, g[A] = a / (c - 1), w[A] = i, y[A] = r, M[A] = 6.5 + 6 * t(), C[A] = s, A++
                        }
                    }
                    const k = new a.LoY;
                    k.setAttribute("position", new a.THS(m, 3)), k.setAttribute("aSeed", new a.THS(f, 1)), k.setAttribute("aEdgeFade", new a.THS(h, 1));
                    const I = new a.BKk({
                            vertexShader: '\n    attribute float aSeed;\n    attribute float aEdgeFade;\n\n    uniform float uTime;\n    uniform float uScatter;\n\n    varying float vIntensity;\n\n    void main() {\n        float breathe = 0.55 + 0.45 * sin(uTime * 0.55 + aSeed * 11.0);\n        vIntensity = breathe * aEdgeFade;\n\n        // The network is the system that survives the dispersal: it expands\n        // furthest and stays readable longest, which is what turns "a brain"\n        // into "inside a brain".\n        // Branchless: multiplied out rather than guarded (see brainMesh.js).\n        float scatter = max(uScatter, 0.0);\n        vec3 radial = normalize(position + vec3(0.0001));\n        vec3 p = position + radial * scatter * (1.3 + aSeed * 2.1);\n        p.y += sin(uTime * 0.15 + aSeed * 19.0) * scatter * 0.18;\n\n        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);\n    }\n',
                            fragmentShader: "\n    precision mediump float;\n\n    uniform vec3 uColor;\n    uniform vec3 uInkColor;\n    uniform float uOpacity;\n    uniform float uInkMix;\n    uniform vec2 uSafeCenter;\n    uniform float uSafeRadius;\n    uniform float uSafeStrength;\n    uniform vec2 uResolution;\n\n    varying float vIntensity;\n\n    void main() {\n        float safe = 1.0;\n        if (uSafeStrength > 0.0) {\n            vec2 uv = gl_FragCoord.xy / uResolution;\n            float d = length((uv - uSafeCenter) / vec2(1.0, 0.72));\n            safe = mix(1.0, smoothstep(uSafeRadius * 0.45, uSafeRadius, d), uSafeStrength);\n        }\n\n        float amount = vIntensity * uOpacity * safe;\n        vec3 glow = uColor * amount;\n        float glowAlpha = clamp(max(glow.r, max(glow.g, glow.b)), 0.0, 1.0);\n        float a = clamp(amount, 0.0, 1.0);\n\n        gl_FragColor = mix(\n            vec4(glow, glowAlpha),\n            vec4(uInkColor * a, a),\n            uInkMix\n        );\n    }\n",
                            uniforms: {
                                uTime: {
                                    value: 0
                                },
                                uOpacity: {
                                    value: 0
                                },
                                uScatter: {
                                    value: 0
                                },
                                uColor: {
                                    value: new a.Q1f(b)
                                },
                                uInkColor: {
                                    value: new a.Q1f(x)
                                },
                                uInkMix: {
                                    value: 0
                                },
                                uSafeCenter: {
                                    value: new a.I9Y(.5, .5)
                                },
                                uSafeRadius: {
                                    value: .62
                                },
                                uSafeStrength: {
                                    value: 0
                                },
                                uResolution: {
                                    value: new a.I9Y(1, 1)
                                }
                            },
                            transparent: !0,
                            blending: a.bCz,
                            blendSrc: a.qad,
                            blendDst: a.OuU,
                            blendSrcAlpha: a.qad,
                            blendDstAlpha: a.OuU,
                            depthWrite: !1
                        }),
                        T = new a.DXC(k, I);
                    T.frustumCulled = !1;
                    const z = new a.LoY;
                    z.setAttribute("position", new a.THS(p, 3)), z.setAttribute("aPathT", new a.THS(g, 1)), z.setAttribute("aSeed", new a.THS(w, 1)), z.setAttribute("aSpeed", new a.THS(y, 1)), z.setAttribute("aSize", new a.THS(M, 1)), z.setAttribute("aHue", new a.THS(C, 1));
                    const F = new a.BKk({
                            vertexShader: "\n    attribute float aPathT;\n    attribute float aSeed;\n    attribute float aSpeed;\n    attribute float aSize;\n    attribute float aHue;\n\n    uniform float uTime;\n    uniform float uPulseWidth;\n    uniform float uGain;\n    uniform float uSizeScale;\n    uniform float uAwake;\n    uniform float uScatter;\n\n    varying float vIntensity;\n    varying float vHue;\n\n    void main() {\n        // Paths above the awake threshold stay dark: real load progress decides\n        // how much of the network has come online.\n        if (aSeed > uAwake) {\n            gl_Position = vec4(2.0, 2.0, 2.0, 1.0);\n            gl_PointSize = 0.0;\n            vIntensity = 0.0;\n            vHue = 0.0;\n            return;\n        }\n\n        float head = fract(aSeed * 7.31 + uTime * aSpeed);\n        float delta = abs(aPathT - head);\n        delta = min(delta, 1.0 - delta);\n\n        float pulse = exp(-pow(delta / uPulseWidth, 2.0));\n        vIntensity = pulse * uGain;\n        vHue = aHue;\n\n        if (vIntensity < 0.01) {\n            gl_Position = vec4(2.0, 2.0, 2.0, 1.0);\n            gl_PointSize = 0.0;\n            return;\n        }\n\n        float scatter = max(uScatter, 0.0);\n        vec3 radial = normalize(position + vec3(0.0001));\n        vec3 p = position + radial * scatter * (1.3 + aSeed * 2.1);\n        p.y += sin(uTime * 0.15 + aSeed * 19.0) * scatter * 0.18;\n\n        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);\n        gl_PointSize = aSize * (0.55 + pulse * 1.9) * uSizeScale / max(0.05, -mvPosition.z);\n        gl_Position = projectionMatrix * mvPosition;\n    }\n",
                            fragmentShader: "\n    precision mediump float;\n\n    uniform vec3 uSignalColor;\n    uniform vec3 uHotColor;\n    uniform vec3 uInkColor;\n    uniform float uOpacity;\n    uniform float uInkMix;\n    uniform vec2 uSafeCenter;\n    uniform float uSafeRadius;\n    uniform float uSafeStrength;\n    uniform vec2 uResolution;\n\n    varying float vIntensity;\n    varying float vHue;\n\n    void main() {\n        float falloff = 1.0 - smoothstep(0.0, 0.5, length(gl_PointCoord - 0.5));\n        if (falloff <= 0.0) discard;\n\n        float safe = 1.0;\n        if (uSafeStrength > 0.0) {\n            vec2 uv = gl_FragCoord.xy / uResolution;\n            float d = length((uv - uSafeCenter) / vec2(1.0, 0.72));\n            safe = mix(1.0, smoothstep(uSafeRadius * 0.45, uSafeRadius, d), uSafeStrength);\n        }\n\n        float amount = falloff * vIntensity * uOpacity * safe;\n        vec3 glow = mix(uSignalColor, uHotColor, vHue) * amount;\n        float glowAlpha = clamp(max(glow.r, max(glow.g, glow.b)), 0.0, 1.0);\n        float a = clamp(amount, 0.0, 1.0);\n\n        gl_FragColor = mix(\n            vec4(glow, glowAlpha),\n            vec4(uInkColor * a, a),\n            uInkMix\n        );\n    }\n",
                            uniforms: {
                                uTime: {
                                    value: 0
                                },
                                uOpacity: {
                                    value: 0
                                },
                                uPulseWidth: {
                                    value: .035
                                },
                                uGain: {
                                    value: 1
                                },
                                uSizeScale: {
                                    value: 1
                                },
                                uAwake: {
                                    value: .4
                                },
                                uScatter: {
                                    value: 0
                                },
                                uSignalColor: {
                                    value: new a.Q1f(b)
                                },
                                uHotColor: {
                                    value: new a.Q1f(S)
                                },
                                uInkColor: {
                                    value: new a.Q1f(x)
                                },
                                uInkMix: {
                                    value: 0
                                },
                                uSafeCenter: {
                                    value: new a.I9Y(.5, .5)
                                },
                                uSafeRadius: {
                                    value: .62
                                },
                                uSafeStrength: {
                                    value: 0
                                },
                                uResolution: {
                                    value: new a.I9Y(1, 1)
                                }
                            },
                            transparent: !0,
                            blending: a.bCz,
                            blendSrc: a.qad,
                            blendDst: a.OuU,
                            blendSrcAlpha: a.qad,
                            blendDstAlpha: a.OuU,
                            depthWrite: !1
                        }),
                        q = new a.ONl(z, F);
                    return q.frustumCulled = !1, {
                        persistent: T,
                        impulses: q,
                        pathCount: u,
                        dispose() {
                            k.dispose(), I.dispose(), z.dispose(), F.dispose()
                        }
                    }
                },
                B = [{
                    share: .55,
                    min: 5.5,
                    max: 13,
                    size: 5.5,
                    brightness: .35
                }, {
                    share: .32,
                    min: 2.6,
                    max: 5.5,
                    size: 9,
                    brightness: .6
                }, {
                    share: .13,
                    min: 1.35,
                    max: 2.6,
                    size: 15,
                    brightness: .9
                }],
                H = async e => {
                    let {
                        container: n,
                        seed: t = 39966,
                        label: s = "stage",
                        onFrame: u
                    } = e;
                    const c = await k(),
                        h = (e => {
                            let n = e >>> 0;
                            return () => (n = 1664525 * n + 1013904223 >>> 0, n / 4294967296)
                        })(t),
                        b = document.createElement("canvas");
                    b.className = "gohary-brain__canvas", b.setAttribute("aria-hidden", "true"), n.appendChild(b);
                    let A = (() => {
                            if ("undefined" === typeof window) return m;
                            const e = window.matchMedia("(pointer: coarse)").matches,
                                n = Math.min(window.innerWidth, window.innerHeight) < 768,
                                t = navigator.hardwareConcurrency || 4,
                                a = navigator.deviceMemory || 4;
                            return t <= 4 || a <= 3 ? d : e || n ? m : f
                        })(),
                        I = v(A);
                    const T = new a.JeP({
                        canvas: b,
                        antialias: !1,
                        alpha: !0,
                        premultipliedAlpha: !0,
                        powerPreference: "high-performance",
                        failIfMajorPerformanceCaveat: !1
                    });
                    T.setClearColor(new a.Q1f(p), 0), T.toneMapping = a.FV, T.toneMappingExposure = .82, T.info.autoReset = !1;
                    const z = new a.Z58,
                        O = new a.ubm(46, 1, .05, 60),
                        H = F(O),
                        D = new a.YJl;
                    D.rotation.set(M.x, M.y, M.z), z.add(D);
                    const E = P(c);
                    D.add(E.root);
                    const _ = R(E.surface, I, h);
                    D.add(_.persistent), D.add(_.impulses);
                    const V = (() => {
                        const e = new a.YJl,
                            n = new a.PTz,
                            t = new a.bdM(1, 1),
                            o = [];
                        return q.forEach(n => {
                            const i = new a.BKk({
                                    vertexShader: "\n    varying vec2 vUv;\n\n    void main() {\n        vUv = uv;\n        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    }\n",
                                    fragmentShader: "\n    precision mediump float;\n\n    uniform vec3 uHotColor;\n    uniform vec3 uFlareColor;\n    uniform float uTime;\n    uniform float uEnergy;\n    uniform float uGain;\n    uniform float uSpikes;\n    uniform float uSoftness;\n\n    varying vec2 vUv;\n\n    void main() {\n        vec2 offset = vUv - 0.5;\n        float radius = length(offset) * 2.0;\n        if (radius > 1.0) discard;\n\n        float falloff = pow(max(0.0, 1.0 - radius), uSoftness);\n\n        // Four radiating spikes, breathing slowly out of phase with the core.\n        float angle = atan(offset.y, offset.x);\n        float spike =\n            pow(abs(cos(angle * 2.0 + 0.6)), 14.0) * 0.6 +\n            pow(abs(cos(angle * 2.0 - 0.9)), 22.0) * 0.4;\n        spike *= pow(max(0.0, 1.0 - radius), 1.3) * uSpikes;\n        spike *= 0.75 + 0.25 * sin(uTime * 0.9);\n\n        float intensity = (falloff + spike) * uGain * uEnergy;\n        vec3 color = mix(uHotColor, uFlareColor, pow(falloff, 2.2));\n\n        vec3 lit = color * intensity;\n        gl_FragColor = vec4(lit, clamp(max(lit.r, max(lit.g, lit.b)), 0.0, 1.0));\n    }\n",
                                    uniforms: {
                                        uHotColor: {
                                            value: new a.Q1f(S)
                                        },
                                        uFlareColor: {
                                            value: new a.Q1f(y)
                                        },
                                        uTime: {
                                            value: 0
                                        },
                                        uEnergy: {
                                            value: 0
                                        },
                                        uGain: {
                                            value: n.gain
                                        },
                                        uSpikes: {
                                            value: n.spikes
                                        },
                                        uSoftness: {
                                            value: n.softness
                                        }
                                    },
                                    transparent: !0,
                                    blending: a.bCz,
                                    blendSrc: a.qad,
                                    blendDst: a.OuU,
                                    blendSrcAlpha: a.qad,
                                    blendDstAlpha: a.OuU,
                                    depthWrite: !1
                                }),
                                r = new a.eaF(t, i);
                            r.scale.setScalar(n.scale), r.frustumCulled = !1, e.add(r), o.push(i)
                        }), {
                            group: e,
                            update(t, a, i) {
                                e.parent ? (e.parent.getWorldQuaternion(n), e.quaternion.copy(n.invert()).multiply(a.quaternion)) : e.quaternion.copy(a.quaternion);
                                const r = 1 + .07 * Math.sin(1.7 * t) + .045 * Math.sin(.83 * t + 1.4) + .02 * Math.sin(2.9 * t + .3);
                                e.children.forEach((e, n) => {
                                    e.scale.setScalar(q[n].scale * r), o[n].uniforms.uTime.value = t, o[n].uniforms.uEnergy.value = i
                                })
                            },
                            dispose() {
                                t.dispose(), o.forEach(e => e.dispose())
                            }
                        }
                    })();
                    V.group.position.copy(C), D.add(V.group);
                    const N = ((e, n) => {
                        const t = new Float32Array(3 * e),
                            o = new Float32Array(e),
                            i = new Float32Array(e),
                            r = new Float32Array(e);
                        let l = 0;
                        B.forEach((a, s) => {
                            const u = s === B.length - 1 ? e - l : Math.round(e * a.share);
                            for (let e = 0; e < u; e++) {
                                const e = 2 * n() - 1,
                                    s = n() * Math.PI * 2,
                                    u = Math.sqrt(Math.max(0, 1 - e * e)),
                                    c = a.min + (a.max - a.min) * Math.cbrt(n());
                                t[3 * l] = u * Math.cos(s) * c, t[3 * l + 1] = e * c * .8, t[3 * l + 2] = u * Math.sin(s) * c, o[l] = a.size * (.6 + .8 * n()), i[l] = a.brightness * (.55 + .45 * n()), r[l] = n(), l++
                            }
                        });
                        const s = new a.LoY;
                        s.setAttribute("position", new a.THS(t, 3)), s.setAttribute("aSize", new a.THS(o, 1)), s.setAttribute("aBrightness", new a.THS(i, 1)), s.setAttribute("aTwinkle", new a.THS(r, 1));
                        const u = new a.BKk({
                                vertexShader: "\n    attribute float aSize;\n    attribute float aBrightness;\n    attribute float aTwinkle;\n\n    uniform float uTime;\n    uniform float uSizeScale;\n    uniform float uStretch;\n    uniform float uSpread;\n\n    varying float vIntensity;\n\n    void main() {\n        // Ambient pushes the field outward so it reads as the space the viewer\n        // is inside, rather than a halo around an object.\n        vec3 p = position * (1.0 + uSpread * 0.55);\n        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);\n\n        float twinkle = 0.72 + 0.28 * sin(uTime * 0.8 + aTwinkle * 24.0);\n        vIntensity = aBrightness * twinkle;\n\n        // On the dive, points that are close to the camera grow a little: the\n        // depth cue the reference gets from motion blur, without the blur.\n        float proximity = 1.0 - smoothstep(1.0, 6.0, -mvPosition.z);\n        float size = aSize * (1.0 + proximity * uStretch);\n\n        gl_PointSize = size * uSizeScale / max(0.05, -mvPosition.z);\n        gl_Position = projectionMatrix * mvPosition;\n    }\n",
                                fragmentShader: "\n    precision mediump float;\n\n    uniform vec3 uColorNear;\n    uniform vec3 uColorFar;\n    uniform vec3 uInkColor;\n    uniform float uOpacity;\n    uniform float uInkMix;\n\n    varying float vIntensity;\n\n    void main() {\n        float falloff = 1.0 - smoothstep(0.0, 0.5, length(gl_PointCoord - 0.5));\n        if (falloff <= 0.0) discard;\n\n        float amount = falloff * vIntensity * uOpacity;\n        vec3 glow = mix(uColorFar, uColorNear, vIntensity) * amount;\n        float glowAlpha = clamp(max(glow.r, max(glow.g, glow.b)), 0.0, 1.0);\n        float a = clamp(amount, 0.0, 1.0);\n\n        gl_FragColor = mix(\n            vec4(glow, glowAlpha),\n            vec4(uInkColor * a, a),\n            uInkMix\n        );\n    }\n",
                                uniforms: {
                                    uTime: {
                                        value: 0
                                    },
                                    uOpacity: {
                                        value: 0
                                    },
                                    uSizeScale: {
                                        value: 1
                                    },
                                    uStretch: {
                                        value: 0
                                    },
                                    uSpread: {
                                        value: 0
                                    },
                                    uInkMix: {
                                        value: 0
                                    },
                                    uColorNear: {
                                        value: new a.Q1f(w)
                                    },
                                    uColorFar: {
                                        value: new a.Q1f(g)
                                    },
                                    uInkColor: {
                                        value: new a.Q1f(x)
                                    }
                                },
                                transparent: !0,
                                blending: a.bCz,
                                blendSrc: a.qad,
                                blendDst: a.OuU,
                                blendSrcAlpha: a.qad,
                                blendDstAlpha: a.OuU,
                                depthWrite: !1
                            }),
                            c = new a.ONl(s, u);
                        return c.frustumCulled = !1, {
                            points: c,
                            material: u,
                            dispose() {
                                s.dispose(), u.dispose()
                            }
                        }
                    })(I.particles, h);
                    z.add(N.points);
                    const U = ((e, n) => {
                        const t = new a.YJl,
                            o = new a.bdM(1, 1),
                            i = [];
                        for (let r = 0; r < e; r++) {
                            const l = new a.BKk({
                                    vertexShader: "\n    varying vec2 vUv;\n\n    void main() {\n        vUv = uv;\n        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    }\n",
                                    fragmentShader: "\n    precision mediump float;\n\n    uniform vec3 uColor;\n    uniform float uOpacity;\n    uniform float uSeed;\n    uniform float uTime;\n\n    varying vec2 vUv;\n\n    void main() {\n        vec2 offset = vUv - 0.5;\n        float radius = length(offset) * 2.0;\n        if (radius > 1.0) discard;\n\n        float core = pow(max(0.0, 1.0 - radius), 2.4);\n\n        // Two slowly drifting lobes break the perfect circle.\n        vec2 lobeA = offset - vec2(sin(uTime * 0.07 + uSeed) * 0.13, cos(uTime * 0.05) * 0.1);\n        vec2 lobeB = offset + vec2(cos(uTime * 0.04 + uSeed) * 0.16, sin(uTime * 0.06) * 0.12);\n        float lobes =\n            pow(max(0.0, 1.0 - length(lobeA) * 2.4), 3.0) * 0.6 +\n            pow(max(0.0, 1.0 - length(lobeB) * 2.1), 3.0) * 0.4;\n\n        vec3 lit = uColor * (core * 0.6 + lobes * 0.4) * uOpacity;\n        gl_FragColor = vec4(lit, clamp(max(lit.r, max(lit.g, lit.b)), 0.0, 1.0));\n    }\n",
                                    uniforms: {
                                        uColor: {
                                            value: new a.Q1f(r % 2 === 0 ? g : w)
                                        },
                                        uOpacity: {
                                            value: 0
                                        },
                                        uSeed: {
                                            value: 10 * n()
                                        },
                                        uTime: {
                                            value: 0
                                        }
                                    },
                                    transparent: !0,
                                    blending: a.bCz,
                                    blendSrc: a.qad,
                                    blendDst: a.OuU,
                                    blendSrcAlpha: a.qad,
                                    blendDstAlpha: a.OuU,
                                    depthWrite: !1
                                }),
                                s = new a.eaF(o, l),
                                u = r / e * Math.PI * 2 + n(),
                                c = 6.5 + 5 * n();
                            s.position.set(Math.cos(u) * c, 3.4 * (n() - .5), Math.sin(u) * c - 5), s.scale.setScalar(4 + 4 * n()), s.frustumCulled = !1, s.renderOrder = -1, t.add(s), i.push(l)
                        }
                        return {
                            group: t,
                            update(e, n, a) {
                                t.children.forEach((t, o) => {
                                    t.quaternion.copy(n.quaternion), i[o].uniforms.uTime.value = e, i[o].uniforms.uOpacity.value = a * (o % 2 === 0 ? .026 : .014)
                                })
                            },
                            dispose() {
                                o.dispose(), i.forEach(e => e.dispose())
                            }
                        }
                    })(I.nebula, h);
                    z.add(U.group);
                    const Y = new o.s(T),
                        W = new i.A(z, O);
                    W.clearAlpha = 0;
                    const G = new r.C(new a.I9Y(1, 1), I.bloom.strength, I.bloom.radius, I.bloom.threshold);
                    G.blendMaterial.blending = a.bCz, G.blendMaterial.blendSrc = a.qad, G.blendMaterial.blendDst = a.qad, G.blendMaterial.blendSrcAlpha = a.ojh, G.blendMaterial.blendDstAlpha = a.qad;
                    const Q = new l.X;
                    Q.material.blending = a.XIg, Y.addPass(W), Y.addPass(G), Y.addPass(Q);
                    const L = I.bloom.strength,
                        j = [E.material, _.persistent.material, _.impulses.material, N.material],
                        X = new a.I9Y(1, 1);
                    let K = 1,
                        J = 0,
                        Z = 0;
                    const $ = () => {
                        const e = Math.max(1, n.clientWidth),
                            t = Math.max(1, n.clientHeight);
                        K = Math.min(window.devicePixelRatio || 1, I.maxPixelRatio), T.setPixelRatio(K), T.setSize(e, t, !1), Y.setPixelRatio(K), Y.setSize(e, t), G.setSize(Math.max(1, Math.round(e * I.bloom.resolutionScale)), Math.max(1, Math.round(t * I.bloom.resolutionScale))), H.setViewport(e, t), X.set(e * K, t * K), j.forEach(e => {
                            e.uniforms.uResolution && e.uniforms.uResolution.value.copy(X)
                        });
                        const a = t * K / 900;
                        N.material.uniforms.uSizeScale.value = a, _.impulses.material.uniforms.uSizeScale.value = a
                    };
                    let ee = 0;
                    const ne = () => {
                            ee || (ee = window.requestAnimationFrame(() => {
                                ee = 0;
                                const e = Math.max(1, n.clientWidth),
                                    t = Math.max(1, n.clientHeight);
                                e === J && t === Z || (J = e, Z = t, $())
                            }))
                        },
                        te = "undefined" !== typeof ResizeObserver ? new ResizeObserver(ne) : null;
                    te ? te.observe(n) : window.addEventListener("resize", ne), J = Math.max(1, n.clientWidth), Z = Math.max(1, n.clientHeight), $();
                    let ae = !1,
                        oe = 0,
                        ie = 0,
                        re = 0,
                        le = 0,
                        se = !1;
                    const ue = () => {
                            const e = (e => e === f ? m : e === m ? d : null)(A);
                            e && (A = e, I = v(A), G.strength = I.bloom.strength, G.radius = I.bloom.radius, G.threshold = I.bloom.threshold, $(), se = !0)
                        },
                        ce = e => {
                            if (!ae) return;
                            oe = requestAnimationFrame(ce);
                            const n = ie ? (e - ie) / 1e3 : 1 / 60;
                            ie = e;
                            const t = Math.min(n, .05);
                            u && u(t), T.info.reset(), Y.render(t), me(), se || (re++, le += t, re >= 90 && (le / re > 1 / 26 && ue(), re = 0, le = 0))
                        },
                        de = () => {
                            document.hidden || (ie = 0)
                        };
                    document.addEventListener("visibilitychange", de);
                    const me = () => {
                            0
                        },
                        fe = null;
                    return {
                        canvas: b,
                        camera: O,
                        rig: H,
                        scene: z,
                        brain: E,
                        brainGroup: D,
                        network: _,
                        ignition: V,
                        particles: N,
                        nebula: U,
                        bloomPass: G,
                        baseBloomStrength: L,
                        inkTargets: j,
                        tier: A,
                        get pixelRatio() {
                            return K
                        },
                        get running() {
                            return ae
                        },
                        stats: () => ({
                            drawCalls: T.info.render.calls,
                            triangles: T.info.render.triangles,
                            tier: A,
                            pixelRatio: K
                        }),
                        start() {
                            ae || (ae = !0, ie = 0, oe = requestAnimationFrame(ce))
                        },
                        stop() {
                            ae = !1, cancelAnimationFrame(oe)
                        },
                        renderOnce() {
                            let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1 / 60;
                            u && u(e), T.info.reset(), Y.render(e)
                        },
                        dispose() {
                            ae = !1, fe && fe(), cancelAnimationFrame(oe), ee && cancelAnimationFrame(ee), document.removeEventListener("visibilitychange", de), te ? te.disconnect() : window.removeEventListener("resize", ne), _.dispose(), N.dispose(), U.dispose(), V.dispose(), E.material.dispose(), Y.dispose(), G.dispose(), T.dispose(), T.forceContextLoss(), b.remove()
                        }
                    }
                },
                D = "boot-intro",
                E = "boot-hold",
                _ = "boot-exit",
                V = "hero-settle",
                N = "hero-idle",
                U = .22,
                Y = e => 1 - Math.pow(1 - e, 3),
                W = e => e < .5 ? 8 * e * e * e * e : 1 - Math.pow(-2 * e + 2, 4) / 2,
                G = e => 1 - Math.pow(1 - e, 5),
                Q = (e, n, t) => e + (n - e) * t,
                L = e => Math.min(1, Math.max(0, e)),
                j = async e => {
                    let {
                        container: n,
                        reducedMotion: t = !1,
                        startAtHero: o = !1,
                        onVeilLift: i,
                        onFlash: r,
                        onSettled: l
                    } = e, s = o ? N : D, u = 0, c = 0, d = !1, m = 0, f = 0, h = U, v = U, p = o, g = o;
                    const w = t ? .9 : 1.6,
                        b = t ? .3 : .62,
                        S = t ? .5 : 1.25,
                        y = new a.Pq0,
                        x = new a.Pq0,
                        M = new a.Pq0,
                        C = new a.Pq0,
                        P = {
                            x: 0,
                            y: 0
                        },
                        A = {
                            x: 0,
                            y: 0,
                            targetX: 0,
                            targetY: 0
                        },
                        k = window.matchMedia("(hover: hover)").matches,
                        I = e => {
                            A.targetX = e.clientX / window.innerWidth * 2 - 1, A.targetY = e.clientY / window.innerHeight * 2 - 1
                        };
                    let T = null;
                    return T = await H({
                        container: n,
                        label: "hero",
                        onFrame: e => {
                            const n = T;
                            if (!n) return;
                            c += e, u += e;
                            const a = L(c / w),
                                o = L(u / w);
                            s === D && o >= 1 ? d ? (s = _, h = f, u = 0) : (s = E, u = 0) : s === E && d && (s = _, h = f, u = 0);
                            let k = 0,
                                I = 0;
                            s === _ && (k = L(u / b), k >= 1 && (v = f, s = V, u = 0)), s === V && (I = L(u / S), !p && I >= .18 && (p = !0, i && i()), I >= 1 && (s = N, u = 0, g || (g = !0, l && l())));
                            const z = s === D || s === E || s === _;
                            t ? f = .08 * Y(a) : s === D ? f = U * Y(a) : s === E ? f = U + .035 * (.5 + .5 * Math.sin(.21 * c)) + .018 * Math.sin(.13 * c + 1.1) + .008 * Math.sin(.37 * c + 2.3) : s === _ && (f = Q(h, h + .05, W(k))), z ? (n.rig.bootPose(f, y, x), n.rig.commit(y, x, P)) : s === V ? (n.rig.bootPose(v, y, x), n.rig.heroPose(M, C), n.rig.blend(y, x, M, C, G(I), P)) : (n.rig.heroPose(y, x), n.rig.commit(y, x, P));
                            const F = L(a / .55),
                                q = L((a - .28) / .5),
                                O = s === _ ? W(k) * (t ? .3 : 1) : 0,
                                R = s === V ? 1 - G(I) : 0,
                                B = Math.max(O, R),
                                H = n.brain.material.uniforms;
                            H.uTime.value = c, H.uScatter.value = 0, H.uInkMix.value = 0, H.uSafeStrength.value = 0, H.uActivity.value = Math.min(1, .7 * m + B), H.uFoldIntensity.value = Q(.6, 1.6, B), H.uCoreEnergy.value = q * Q(.45, 1.6, B), H.uRimIntensity.value = Q(.09, .2, B), H.uOpacity.value = F;
                            const j = n.network.persistent.material.uniforms;
                            j.uTime.value = c, j.uScatter.value = 0, j.uInkMix.value = 0, j.uSafeStrength.value = 0, j.uOpacity.value = F * Q(.18, .44, Math.max(m, B));
                            const X = n.network.impulses.material.uniforms;
                            if (X.uTime.value = c, X.uScatter.value = 0, X.uInkMix.value = 0, X.uSafeStrength.value = 0, X.uOpacity.value = q, X.uGain.value = t ? .35 : Q(.6, 1.6, B), X.uPulseWidth.value = Q(.035, .06, B), X.uAwake.value = Math.max(.2 + .7 * m, B > 0 ? 1 : 0), n.particles.material.uniforms.uTime.value = c, n.particles.material.uniforms.uSpread.value = 0, n.particles.material.uniforms.uInkMix.value = 0, n.particles.material.uniforms.uOpacity.value = Math.min(1, a / .35), n.particles.material.uniforms.uStretch.value = 1.35 * O, n.ignition.update(c, n.camera, q * Q(.4, 1.6, B)), n.nebula.update(c, n.camera, F), n.bloomPass.strength = n.baseBloomStrength * Q(1, 2.8, B), r) {
                                const e = s === _ ? Math.pow(k, 2.2) : 0,
                                    n = s === V ? 1 - G(L(I / .8)) : 0;
                                r(Math.max(e, n) * (t ? .32 : .86))
                            }
                            t || (A.x += (A.targetX - A.x) * Math.min(1, 2.4 * e), A.y += (A.targetY - A.y) * Math.min(1, 2.4 * e), n.brainGroup.rotation.y = n.brainGroup.userData.baseY + .035 * A.x, n.brainGroup.rotation.x = n.brainGroup.userData.baseX + .026 * A.y), n.brainGroup.scale.setScalar(1 + .006 * Math.sin(.62 * c));
                            const K = z ? 1 - O : .35;
                            P.x = .035 * Math.sin(.17 * c) * K, P.y = .022 * Math.sin(.11 * c + .8) * K
                        }
                    }), T.brainGroup.userData.baseX = T.brainGroup.rotation.x, T.brainGroup.userData.baseY = T.brainGroup.rotation.y, k && !t && window.addEventListener("pointermove", I, {
                        passive: !0
                    }), {
                        get stage() {
                            return s
                        },
                        stats: T.stats,
                        start: T.start,
                        stop: T.stop,
                        setReady() {
                            d = !0
                        },
                        setProgress(e) {
                            m = L(e)
                        },
                        dispose() {
                            window.removeEventListener("pointermove", I), T.dispose()
                        }
                    }
                }
        }
    }
]);