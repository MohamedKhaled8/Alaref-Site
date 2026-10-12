 var e
            },
            yy = () => {
                by = !0
            },
            _y = e => {
                let {
                    children: n
                } = e;
                const [r, a] = (0, t.useState)(xy), [o, s] = (0, t.useState)(() => r ? my : vy), i = (0, t.useCallback)(e => {
                    s(e), e !== gy && e !== vy || (yy(), a(!1))
                }, []), l = (0, t.useMemo)(() => ({
                    playBoot: r,
                    phase: o,
                    setPhase: i
                }), [r, o, i]);
                return (0, mr.jsx)(fy.Provider, {
                    value: l,
                    children: n
                })
            },
            wy = () => (0, t.useContext)(fy),
            jy = () => "undefined" !== typeof window && "function" === typeof window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
            ky = e => {
                let {
                    text: n,
                    className: r = "",
                    wordDelay: a = 38,
                    startDelay: o = 250,
                    start: s = !0,
                    as: i = "p"
                } = e;
                const l = (0, t.useMemo)(() => (e => {
                        if ("undefined" !== typeof Intl && "function" === typeof Intl.Segmenter) try {
                            const t = new Intl.Segmenter("ar", {
                                granularity: "word"
                            });
                            return Array.from(t.segment(e), e => e.segment)
                        } catch (t) {}
                        return e.split(/(\s+)/).filter(Boolean)
                    })(n), [n]),
                    c = (0, t.useRef)(!1),
                    [d, u] = (0, t.useState)(() => jy() ? 1 / 0 : 0),
                    p = (0, t.useRef)(null);
                return (0, t.useEffect)(() => {
                    if (c.current) return;
                    if (!s) return;
                    if (jy()) return c.current = !0, void u(1 / 0);
                    const e = p.current;
                    if (!e) return;
                    let t, n = !1;
                    const r = () => {
                        let e = 0;
                        const r = () => {
                            if (!n) {
                                for (e += 1; e < l.length && !l[e].trim();) e += 1;
                                u(e), e >= l.length ? c.current = !0 : t = window.setTimeout(r, a)
                            }
                        };
                        t = window.setTimeout(r, o)
                    };
                    if ("undefined" === typeof IntersectionObserver) return r(), () => {
                        n = !0, window.clearTimeout(t)
                    };
                    const i = new IntersectionObserver(e => {
                        e.some(e => e.isIntersecting) && (i.disconnect(), window.clearTimeout(d), r())
                    }, {
                        threshold: .2
                    });
                    i.observe(e);
                    const d = window.setTimeout(() => {
                        i.disconnect(), c.current = !0, u(1 / 0)
                    }, 4e3);
                    return () => {
                        n = !0, i.disconnect(), window.clearTimeout(d), window.clearTimeout(t)
                    }
                }, [l, a, o, s]), (0, mr.jsxs)(i, {
                    ref: p,
                    className: r,
                    children: [(0, mr.jsx)("span", {
                        className: "sr-only",
                        children: n
                    }), (0, mr.jsx)("span", {
                        "aria-hidden": "true",
                        children: l.map((e, t) => (0, mr.jsx)("span", {
                            className: "typewriter__word".concat(t < d ? " is-shown" : ""),
                            children: e
                        }, "".concat(t, "-").concat(e)))
                    })]
                })
            },
            Cy = n.p + "static/media/hero-doctor.3e53f992f5ef96ed0045.webp",
            Sy = n.p + "static/media/microscope.27b6b265d533d3fc7667.webp",
            Ny = (e, t) => new Promise(n => {
                const r = setTimeout(n, t);
                e.then(() => {
                    clearTimeout(r), n()
                }, () => {
                    clearTimeout(r), n()
                })
            }),
            Ey = function() {
                let e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
                const [n, r] = (0, t.useState)(!e), [a, o] = (0, t.useState)(e ? 0 : 1), s = (0, t.useRef)(!e);
                return (0, t.useEffect)(() => {
                    if (!e) return;
                    let t = !1;
                    let n = 0;
                    const a = () => {
                            t || (n += 1, o(Math.min(1, n / 3)))
                        },
                        i = () => {
                            t || s.current || (s.current = !0, o(1), r(!0))
                        },
                        l = setTimeout(i, 8e3),
                        c = document.fonts ? Ny(document.fonts.ready, 3500) : Promise.resolve();
                    return (async () => {
                        await Promise.race([new Promise(e => {
                            requestAnimationFrame(() => requestAnimationFrame(e))
                        }), new Promise(e => setTimeout(e, 300))]), a(), await c, a(), await Ny((() => {
                            const e = window.innerHeight || 0,
                                t = Array.from(document.images).filter(e => "lazy" !== e.loading).filter(t => {
                                    const n = t.getBoundingClientRect();
                                    return n.bottom > 0 && n.top < 1.1 * e && n.width > 0
                                }).slice(0, 6);
                            return t.length ? Promise.all(t.map(e => e.complete ? Promise.resolve() : new Promise(t => {
                                e.addEventListener("load", t, {
                                    once: !0
                                }), e.addEventListener("error", t, {
                                    once: !0
                                })
                            }))) : Promise.resolve()
                        })(), 4500), a(), i()
                    })(), () => {
                        t = !0, clearTimeout(l)
                    }
                }, [e]), {
                    ready: n,
                    progress: a
                }
            },
            Dy = () => {
                const e = wy(),
                    [r] = (0, t.useState)(() => Boolean(e && e.playBoot) && !by),
                    [a, o] = (0, t.useState)(r),
                    [s, i] = (0, t.useState)(!1),
                    l = (0, t.useRef)(null),
                    c = (0, t.useRef)(null),
                    d = (0, t.useRef)(null),
                    u = (0, t.useRef)(!r),
                    {
                        ready: p,
                        progress: h
                    } = Ey(r),
                    f = "undefined" !== typeof window && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
                    m = (0, t.useCallback)(() => {
                        u.current || (u.current = !0, yy(), document.body.classList.remove("brain-booting"), document.body.classList.add("brain-entering"), window.setTimeout(() => document.body.classList.remove("brain-entering"), 1800), o(!1), e && e.setPhase(gy))
                    }, [e]),
                    g = (0, t.useCallback)(e => {
                        const t = c.current;
                        t && (t.style.opacity = String(Math.min(1, Math.max(0, e))))
                    }, []),
                    v = (0, t.useCallback)(() => {
                        e && e.setPhase(vy)
                    }, [e]),
                    b = (0, t.useRef)({});
                return b.current = {
                    liftVeil: m,
                    paintFlash: g,
                    settled: v
                }, (0, t.useEffect)(() => {
                    r && document.body.classList.add("brain-booting");
                    let e = !1;
                    return (() => {
                        try {
                            const e = document.createElement("canvas");
                            return Boolean(window.WebGLRenderingContext && (e.getContext("webgl2") || e.getContext("webgl")))
                        } catch (e) {
                            return !1
                        }
                    })() ? (Promise.all([n.e(437), n.e(219), n.e(347)]).then(n.bind(n, 3498)).then(t => {
                        let {
                            createHeroBrainDirector: n
                        } = t;
                        return e || !l.current ? null : n({
                            container: l.current,
                            reducedMotion: f,
                            startAtHero: !r,
                            onVeilLift: () => b.current.liftVeil(),
                            onFlash: e => b.current.paintFlash(e),
                            onSettled: () => b.current.settled()
                        })
                    }).then(t => {
                        t && (e ? t.dispose() : (d.current = t, t.start()))
                    }).catch(t => {
                        console.error("Gohary hero brain failed to start:", t), e || i(!0)
                    }), () => {
                        e = !0, document.body.classList.remove("brain-booting"), document.body.classList.remove("brain-entering"), d.current && (d.current.dispose(), d.current = null)
                    }) : (i(!0), () => {
                        document.body.classList.remove("brain-booting")
                    })
                }, [r, f]), (0, t.useEffect)(() => {
                    const e = l.current;
                    if (!e || "undefined" === typeof IntersectionObserver) return;
                    const t = new IntersectionObserver(e => {
                        const t = e.some(e => e.isIntersecting),
                            n = d.current;
                        n && (t ? n.start() : n.stop())
                    }, {
                        threshold: 0,
                        rootMargin: "10% 0px 10% 0px"
                    });
                    return t.observe(e), () => t.disconnect()
                }, []), (0, t.useEffect)(() => {
                    d.current && d.current.setProgress(h)
                }, [h]), (0, t.useEffect)(() => {
                    if (!r || !p) return;
                    const e = window.setTimeout(m, s && !d.current ? 950 : 4500);
                    return () => window.clearTimeout(e)
                }, [r, p, s, m]), (0, t.useEffect)(() => {
                    if (!r || !p) return;
                    if (d.current) return void d.current.setReady();
                    const e = window.setInterval(() => {
                        d.current && (d.current.setReady(), window.clearInterval(e))
                    }, 120);
                    return () => window.clearInterval(e)
                }, [r, p]), (0, mr.jsxs)("div", {
                    className: "hero-brain",
                    "aria-hidden": "true",
                    children: [s ? (0, mr.jsx)("div", {
                        className: "hero-brain__fallback",
                        children: (0, mr.jsx)("span", {
                            className: "hero-brain__pulse"
                        })
                    }) : (0, mr.jsxs)(mr.Fragment, {
                        children: [(0, mr.jsx)("div", {
                            className: "hero-brain__veil ".concat(a ? "" : "is-lifted")
                        }), (0, mr.jsx)("div", {
                            className: "hero-brain__stage",
                            ref: l
                        })]
                    }), (0, mr.jsx)("div", {
                        ref: c,
                        className: "hero-brain__flash"
                    }), a && (0, mr.jsxs)("div", {
                        className: "hero-brain__mark",
                        children: [(0, mr.jsx)(Du, {
                            className: "h-7 w-auto sm:h-8",
                            title: "\u0645\u0646\u0635\u0629 \u0627\u0644\u062c\u0648\u0647\u0631\u064a"
                        }), (0, mr.jsx)("span", {
                            className: "sr-only",
                            role: "status",
                            "aria-live": "polite",
                            children: "\u062c\u0627\u0631\u064a \u062a\u062c\u0647\u064a\u0632 \u0627\u0644\u0645\u0646\u0635\u0629"
                        })]
                    })]
                })
            },
            Ay = e => {
                let {
                    bleedUnderNavbar: n = !0
                } = e;
                const r = (e => {
                        const n = (0, t.useRef)(null),
                            r = (0, t.useRef)(0),
                            a = (0, t.useCallback)(() => {
                                const e = n.current;
                                if (!e) return;
                                const t = r.current,
                                    a = Math.round(e.getBoundingClientRect().top + window.scrollY - t),
                                    o = a > 0 ? -a : 0;
                                o !== t && (r.current = o, e.style.marginTop = o ? "".concat(o, "px") : "0px")
                            }, []);
                        return (0, t.useLayoutEffect)(() => {
                            const t = n.current;
                            if (!e || !t) return;
                            a();
                            let o = 0;
                            const s = () => {
                                o || (o = window.requestAnimationFrame(() => {
                                    o = 0, a()
                                }))
                            };
                            let i;
                            return s(), window.addEventListener("resize", s), window.addEventListener("load", s), document.fonts && document.fonts.ready && document.fonts.ready.then(s).catch(() => {}), "undefined" !== typeof ResizeObserver && (i = new ResizeObserver(s), i.observe(document.body)), () => {
                                o && window.cancelAnimationFrame(o), window.removeEventListener("resize", s), window.removeEventListener("load", s), i && i.disconnect(), r.current = 0, t.style.marginTop = ""
                            }
                        }, [e, a]), n
                    })(n),
                    a = (() => {
                        const e = wy(),
                            n = e ? e.phase : vy,
                            [r, a] = (0, t.useState)(!1);
                        return (0, t.useEffect)(() => {
                            if (r) return;
                            if (n === my) return;
                            const e = window.requestAnimationFrame(() => a(!0)),
                                t = window.setTimeout(() => a(!0), 80);
                            return () => {
                                window.cancelAnimationFrame(e), window.clearTimeout(t)
                            }
                        }, [n, r]), r
                    })();
                return (0, mr.jsxs)("section", {
                    ref: r,
                    className: "hero-canopy hero-orchestra w-full ".concat(a ? "is-entered" : "", " ").concat(n ? "hero-canopy--bleed" : "rounded-3xl"),
                    children: [(0, mr.jsxs)("div", {
                        className: "hero-atmosphere",
                        "aria-hidden": "true",
                        children: [(0, mr.jsx)("span", {
                            className: "hero-atmosphere__grain"
                        }), (0, mr.jsx)("span", {
                            className: "hero-atmosphere__wash hero-atmosphere__wash--light"
                        }), (0, mr.jsx)("span", {
                            className: "hero-atmosphere__wash hero-atmosphere__wash--dark"
                        })]
                    }), (0, mr.jsx)("div", {
                        className: "hero-scrim",
                        "aria-hidden": "true"
                    }), (0, mr.jsx)(Dy, {}), (0, mr.jsx)("div", {
                        className: "hero-stage",
                        "aria-hidden": "true",
                        children: (0, mr.jsx)("img", {
                            src: Cy,
                            alt: "",
                            className: "hero-doctor px-20",
                            width: "1200",
                            height: "1607",
                            decoding: "async"
                        })
                    }), (0, mr.jsx)("svg", {
                        className: "hero-curve",
                        viewBox: "0 0 1440 119.381",
                        preserveAspectRatio: "none",
                        "aria-hidden": "true",
                        focusable: "false",
                        children: (0, mr.jsx)("path", {
                            d: "M1440 119.381C1275.17 48.462 955.659 0 657.716 0C379.317 0 135.403 42.312 0 105.721L0 119.381Z"
                        })
                    }), (0, mr.jsxs)("div", {
                        className: "hero-stage",
                        "aria-hidden": "true",
                        children: [(0, mr.jsx)("img", {
                            src: Sy,
                            alt: "",
                            className: "hero-microscope hero-microscope--start",
                            width: "500",
                            height: "430",
                            loading: "lazy",
                            decoding: "async"
                        }), (0, mr.jsx)("img", {
                            src: Sy,
                            alt: "",
                            className: "hero-microscope hero-microscope--end",
                            width: "500",
                            height: "430",
                            loading: "lazy",
                            decoding: "async"
                        })]
                    }), (0, mr.jsxs)("div", {
                        className: "hero-copy landing-shell relative z-[4] flex flex-col gap-8 pb-[14vw] sm:pb-[16vw] md:grid md:grid-cols-12 md:items-start md:gap-x-6 md:gap-y-8 md:pb-[12vw] xl:pb-[16vw] ".concat(n ? "pt-[calc(var(--navbar-height)+1.25rem)] md:pt-[calc(var(--navbar-height)+7vw)] xl:pt-[calc(var(--navbar-height)+12.4vw)]" : "pt-12 md:pt-[7vw] xl:pt-[9vw]"),
                        children: [(0, mr.jsxs)("div", {
                            className: "hero-lede order-1 flex flex-col items-center text-center md:col-span-6 md:items-start md:text-right xl:col-span-5",
                            children: [(0, mr.jsx)("p", {
                                "data-enter": !0,
                                style: {
                                    "--enter-delay": "300ms",
                                    "--enter-from": "10px"
                                },
                                className: "landing-display m-0 text-secondary-500 text-[clamp(1.5rem,3.3vw,3rem)] font-w-bold",
                                children: "\u062f /\u0623\u062d\u0645\u062f \u0627\u0644\u062c\u064f\u0648\u0647\u0631\u064a"
                            }), (0, mr.jsxs)("h1", {
                                className: "landing-display m-0 mt-1 text-primary-950 dark:text-white theme-shift smooth text-[clamp(1.5rem,3.3vw,3rem)] font-w-bold",
                                children: [(0, mr.jsx)("span", {
                                    className: "hero-line",
                                    style: {
                                        "--enter-delay": "380ms"
                                    },
                                    children: (0, mr.jsxs)("span", {
                                        children: ["\u0631\u062d\u0644\u062a\u0643 \u0628\u062a\u0628\u062f\u0623 \u0645\u0639 ", (0, mr.jsx)("span", {
                                            className: "text-white",
                                            children: "\u0627\u0644\u062c\u0648\u0647\u0631\u064a"
                                        })]
                                    })
                                }), (0, mr.jsx)("span", {
                                    className: "hero-line",
                                    style: {
                                        "--enter-delay": "465ms"
                                    },
                                    children: (0, mr.jsx)("span", {
                                        children: "\u062e\u064f\u062f \u0623\u0648\u0644 \u062e\u0637\u0648\u0629..\u0648\u0623\u0646\u062a \u0648\u0627\u062b\u0642"
                                    })
                                })]
                            }), (0, mr.jsx)("p", {
                                "data-enter": !0,
                                style: {
                                    "--enter-delay": "520ms"
                                },
                                className: "mt-6 max-w-[25rem] text-[clamp(0.95rem,1.25vw,1.125rem)] font-w-bold leading-relaxed text-primary-950 dark:text-white theme-shift smooth",
                                children: "\u062a\u062c\u0631\u0628\u0629 \u062a\u0639\u0644\u064a\u0645\u064a\u0629 \u0645\u062a\u0643\u0627\u0645\u0644\u0629 \u062a\u0633\u062a\u062d\u0642 \u062a\u0628\u062f\u0623 \u0628\u064a\u0647\u0627 \u0644\u0623\u0646 \u0643\u0644 \u062a\u0641\u0635\u064a\u0644\u0629 \u0645\u0635\u0645\u0645\u0629 \u0639\u0644\u0634\u0627\u0646\u0643"
                            }), (0, mr.jsx)("div", {
                                "data-enter": !0,
                                style: {
                                    "--enter-delay": "640ms",
                                    "--enter-from": "10px"
                                },
                                className: "mt-7",
                                children: (0, mr.jsx)(fd, {
                                    element: "Link",
                                    to: "/register",
                                    className: "inline-flex w-[11.9rem] justify-center rounded-[10px] border-2 border-accent-500 bg-accent-500 px-6 py-3.5 text-sm font-w-bold text-primary-950 smooth hover:-translate-y-0.5 hover:bg-accent-400 hover:border-accent-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                                    children: "\u0633\u062c\u0644 \u0648\u062e\u062f \u0623\u0648\u0644 \u062e\u0637\u0648\u0629"
                                })
                            })]
                        }), (0, mr.jsxs)("div", {
                            "data-enter": !0,
                            style: {
                                "--enter-delay": "740ms"
                            },
                            className: "hero-about order-2 max-w-[25rem] self-center text-center text-white md:col-span-6 md:col-start-1 md:row-start-2 md:self-start md:text-right xl:col-span-3 xl:col-start-10 xl:row-start-1 xl:-mt-[2.5vw] xl:max-w-[20.1rem]",
                            children: [(0, mr.jsx)("h2", {
                                className: "landing-display m-0 text-[clamp(1rem,1.4vw,1.25rem)] font-w-bold",
                                children: "\u0645\u0646\u0635\u0629 \u0627\u0644\u062c\u0648\u0647\u0631\u064a :"
                            }), (0, mr.jsx)(ky, {
                                start: a,
                                text: "\u0623\u0643\u0628\u0631 \u0645\u0646\u0635\u0629 \u062a\u0639\u0644\u064a\u0645\u064a\u0629 \u0645\u0635\u0645\u0645\u0629 \u0644\u0645\u0633\u0627\u0639\u062f\u0629 \u0637\u0644\u0627\u0628 \u0627\u0644\u062b\u0627\u0646\u0648\u064a\u0629 \u0627\u0644\u0639\u0627\u0645\u0629 \u0648\u0627\u0644\u0623\u0632\u0647\u0631\u064a\u0629 \u0641\u064a \u0645\u0627\u062f\u062a\u064a \u0627\u0644\u0623\u062d\u064a\u0627\u0621 \u0648\u0639\u0644\u0648\u0645 \u0627\u0644\u0623\u0631\u0636 \u0648\u0627\u0644\u0639\u0644\u0648\u0645 \u0627\u0644\u0645\u062a\u0643\u0627\u0645\u0644\u0629 \u0644\u0644\u0635\u0641 \u0627\u0644\u0623\u0648\u0644 \u0627\u0644\u062b\u0627\u0646\u0648\u064a\u060c \u0648\u064a\u0642\u062f\u0645 \u062f. \u0627\u0644\u062c\u0648\u0647\u0631\u064a \u0645\u062d\u0627\u0636\u0631\u0627\u062a \u062a\u0639\u0644\u064a\u0645\u064a\u0629 \u062a\u062d\u062a\u0648\u064a \u0639\u0644\u0649 \u0634\u0631\u062d \u0643\u0627\u0641\u064d \u0648\u0648\u0627\u0641\u064d \u0628\u0637\u0631\u064a\u0642\u0629 \u0645\u0628\u0633\u0637\u0629 \u0642\u0627\u0626\u0645\u0629 \u0639\u0644\u0649 \u0637\u0631\u0642 \u0627\u0644\u062a\u0639\u0644\u064a\u0645 \u0627\u0644\u062d\u062f\u064a\u062b\u0629 \u0648\u0627\u0644\u0645\u062a\u0637\u0648\u0631\u0629 \u0644\u0643\u064a \u062a\u0646\u0627\u0633\u0628 \u062c\u0645\u064a\u0639 \u0645\u0633\u062a\u0648\u064a\u0627\u062a \u0627\u0644\u0637\u0644\u0627\u0628\u060c \u0628\u0627\u0644\u0625\u0636\u0627\u0641\u0629 \u0644\u0645\u062d\u0627\u0636\u0631\u0627\u062a \u062d\u0644 \u0628\u0646\u0648\u0643 \u0623\u0633\u0626\u0644\u0629 \u0636\u062e\u0645\u0629 \u0645\u0646 \u0633\u0644\u0633\u0644\u0629 \u0643\u062a\u0628 \u0627\u0644\u062c\u0648\u0647\u0631\u064a \u0630\u0627\u062a \u0645\u0633\u062a\u0648\u064a\u0627\u062a \u0639\u064f\u0644\u064a\u0627 \u0644\u0644\u062a\u062f\u0631\u064a\u0628 \u0648\u0627\u0644\u062a\u0637\u0628\u064a\u0642 \u0639\u0644\u0649 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0629.",
                                className: "mt-3 text-[0.8125rem] leading-[1.75] text-white/85 xl:text-xs xl:leading-[1.6]"
                            })]
                        })]
                    })]
                })
            };

        function Ty(e) {
            return null !== e && "object" === typeof e && "constructor" in e && e.constructor === Object
        }

        function My(e, t) {
            void 0 === e && (e = {}), void 0 === t && (t = {}), Object.keys(t).forEach(n => {
                "undefined" === typeof e[n] ? e[n] = t[n] : Ty(t[n]) && Ty(e[n]) && Object.keys(t[n]).length > 0 && My(e[n], t[n])
            })
        }
        const Oy = {
            body: {},
            addEventListener() {},
            removeEventListener() {},
            activeElement: {
                blur() {},
                nodeName: ""
            },
            querySelector: () => null,
            querySelectorAll: () => [],
            getElementById: () => null,
            createEvent: () => ({
                initEvent() {}
            }),
            createElement: () => ({
                children: [],
                childNodes: [],
                style: {},
                setAttribute() {},
                getElementsByTagName: () => []
            }),
            createElementNS: () => ({}),
            importNode: () => null,
            location: {
                hash: "",
                host: "",
                hostname: "",
                href: "",
                origin: "",
                pathname: "",
                protocol: "",
                search: ""
            }
        };

        function Py() {
            const e = "undefined" !== typeof document ? document : {};
            return My(e, Oy), e
        }
        const Fy = {
            document: Oy,
            navigator: {
                userAgent: ""
            },
            location: {
                hash: "",
                host: "",
                hostname: "",
                href: "",
                origin: "",
                pathname: "",
                protocol: "",
                search: ""
            },
            history: {
                replaceState() {},
                pushState() {},
                go() {},
                back() {}
            },
            CustomEvent: function() {
                return this
            },
            addEventListener() {},
            removeEventListener() {},
            getComputedStyle: () => ({
                getPropertyValue: () => ""
            }),
            Image() {},
            Date() {},
            screen: {},
            setTimeout() {},
            clearTimeout() {},
            matchMedia: () => ({}),
            requestAnimationFrame: e => "undefined" === typeof setTimeout ? (e(), null) : setTimeout(e, 0),
            cancelAnimationFrame(e) {
                "undefined" !== typeof setTimeout && clearTimeout(e)
            }
        };

        function Ly() {
            const e = "undefined" !== typeof window ? window : {};
            return My(e, Fy), e
        }

        function Iy(e, t) {
            return void 0 === t && (t = 0), setTimeout(e, t)
        }

        function Ry() {
            return Date.now()
        }

        function By(e, t) {
            void 0 === t && (t = "x");
            const n = Ly();
            let r, a, o;
            const s = function(e) {
                const t = Ly();
                let n;
                return t.getComputedStyle && (n = t.getComputedStyle(e, null)), !n && e.currentStyle && (n = e.currentStyle), n || (n = e.style), n
            }(e);
            return n.WebKitCSSMatrix ? (a = s.transform || s.webkitTransform, a.split(",").length > 6 && (a = a.split(", ").map(e => e.replace(",", ".")).join(", ")), o = new n.WebKitCSSMatrix("none" === a ? "" : a)) : (o = s.MozTransform || s.OTransform || s.MsTransform || s.msTransform || s.transform || s.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"), r = o.toString().split(",")), "x" === t && (a = n.WebKitCSSMatr