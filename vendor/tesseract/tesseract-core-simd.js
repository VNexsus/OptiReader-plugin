
var TesseractCore = (() => {
    var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
    if (typeof __filename !== 'undefined')
        _scriptDir = _scriptDir || __filename;
    return (
        function (TesseractCore) {
        TesseractCore = TesseractCore || {};

        var b;
        b || (b = typeof TesseractCore !== 'undefined' ? TesseractCore : {});
        var aa,
        ba;
        b.ready = new Promise(function (a, c) {
            aa = a;
            ba = c
        });
        var ca = Object.assign({}, b),
        da = "./this.program",
        ea = (a, c) => {
            throw c;
        },
        fa = "object" == typeof window,
        ha = "function" == typeof importScripts,
        ia = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node,
        f = "",
        ja,
        ka,
        la,
        fs,
        ma,
        na;
        if (ia)
            f = ha ? require("path").dirname(f) + "/" : __dirname + "/", na = () => {
                ma || (fs = require("fs"), ma = require("path"))
            },
        ja = function (a, c) {
            na();
            a = ma.normalize(a);
            return fs.readFileSync(a, c ? void 0 : "utf8")
        },
        la = a => {
            a = ja(a, !0);
            a.buffer || (a = new Uint8Array(a));
            return a
        },
        ka = (a, c, d) => {
            na();
            a = ma.normalize(a);
            fs.readFile(a, function (e, g) {
                e ? d(e) : c(g.buffer)
            })
        },
        1 < process.argv.length && (da = process.argv[1].replace(/\\/g, "/")),
        process.argv.slice(2),
        process.on("uncaughtException", function (a) {
            if (!(a instanceof oa))
                throw a;
        }),
        process.on("unhandledRejection",
            function (a) {
            throw a;
        }),
        ea = (a, c) => {
            if (noExitRuntime)
                throw process.exitCode = a, c;
            c instanceof oa || pa("exiting due to exception: " + c);
            process.exit(a)
        },
        b.inspect = function () {
            return "[Emscripten Module object]"
        };
        else if (fa || ha)
            ha ? f = self.location.href : "undefined" != typeof document && document.currentScript && (f = document.currentScript.src), _scriptDir && (f = _scriptDir), 0 !== f.indexOf("blob:") ? f = f.substr(0, f.replace(/[?#].*/, "").lastIndexOf("/") + 1) : f = "", ja = a => {
                var c = new XMLHttpRequest;
                c.open("GET", a, !1);
                c.send(null);
                return c.responseText
            },
        ha && (la = a => {
                var c = new XMLHttpRequest;
                c.open("GET", a, !1);
                c.responseType = "arraybuffer";
                c.send(null);
                return new Uint8Array(c.response)
            }),
        ka = (a, c, d) => {
            var e = new XMLHttpRequest;
            e.open("GET", a, !0);
            e.responseType = "arraybuffer";
            e.onload = () => {
                200 == e.status || 0 == e.status && e.response ? c(e.response) : d()
            };
            e.onerror = d;
            e.send(null)
        };
        var qa = b.print || console.log.bind(console),
        pa = b.printErr || console.warn.bind(console);
        Object.assign(b, ca);
        ca = null;
        b.thisProgram && (da = b.thisProgram);
        b.quit && (ea = b.quit);
        var ra = 0,
        sa;
        b.wasmBinary && (sa = b.wasmBinary);
        var noExitRuntime = b.noExitRuntime || !0;
        "object" != typeof WebAssembly && n("no native wasm support detected");
        var ta,
        ua = !1,
        wa = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;
        function xa(a, c) {
            for (var d = c + NaN, e = c; a[e] && !(e >= d); )
                ++e;
            if (16 < e - c && a.buffer && wa)
                return wa.decode(a.subarray(c, e));
            for (d = ""; c < e; ) {
                var g = a[c++];
                if (g & 128) {
                    var h = a[c++] & 63;
                    if (192 == (g & 224))
                        d += String.fromCharCode((g & 31) << 6 | h);
                    else {
                        var k = a[c++] & 63;
                        g = 224 == (g & 240) ? (g & 15) << 12 | h << 6 | k : (g & 7) << 18 | h << 12 | k << 6 | a[c++] & 63;
                        65536 > g ? d += String.fromCharCode(g) : (g -= 65536, d += String.fromCharCode(55296 | g >> 10, 56320 | g & 1023))
                    }
                } else
                    d += String.fromCharCode(g)
            }
            return d
        }
        function q(a) {
            return a ? xa(ya, a) : ""
        }
        function za(a, c, d, e) {
            if (!(0 < e))
                return 0;
            var g = d;
            e = d + e - 1;
            for (var h = 0; h < a.length; ++h) {
                var k = a.charCodeAt(h);
                if (55296 <= k && 57343 >= k) {
                    var m = a.charCodeAt(++h);
                    k = 65536 + ((k & 1023) << 10) | m & 1023
                }
                if (127 >= k) {
                    if (d >= e)
                        break;
                    c[d++] = k
                } else {
                    if (2047 >= k) {
                        if (d + 1 >= e)
                            break;
                        c[d++] = 192 | k >> 6
                    } else {
                        if (65535 >= k) {
                            if (d + 2 >= e)
                                break;
                            c[d++] = 224 | k >> 12
                        } else {
                            if (d + 3 >= e)
                                break;
                            c[d++] = 240 | k >> 18;
                            c[d++] = 128 | k >> 12 & 63
                        }
                        c[d++] = 128 | k >> 6 & 63
                    }
                    c[d++] = 128 | k & 63
                }
            }
            c[d] = 0;
            return d - g
        }
        function Aa(a) {
            for (var c = 0, d = 0; d < a.length; ++d) {
                var e = a.charCodeAt(d);
                127 >= e ? c++ : 2047 >= e ? c += 2 : 55296 <= e && 57343 >= e ? (c += 4, ++d) : c += 3
            }
            return c
        }
        var Ba,
        r,
        ya,
        Ca,
        v,
        y,
        Da,
        Ea;
        function Fa() {
            var a = ta.buffer;
            Ba = a;
            b.HEAP8 = r = new Int8Array(a);
            b.HEAP16 = Ca = new Int16Array(a);
            b.HEAP32 = v = new Int32Array(a);
            b.HEAPU8 = ya = new Uint8Array(a);
            b.HEAPU16 = new Uint16Array(a);
            b.HEAPU32 = y = new Uint32Array(a);
            b.HEAPF32 = Da = new Float32Array(a);
            b.HEAPF64 = Ea = new Float64Array(a)
        }
        var Ga,
        Ha = [],
        Ia = [],
        Ka = [],
        La = !1;
        function Ma() {
            var a = b.preRun.shift();
            Ha.unshift(a)
        }
        var Na = 0,
        Oa = null,
        Pa = null;
        function Qa() {
            Na++;
            b.monitorRunDependencies && b.monitorRunDependencies(Na)
        }
        function Ra() {
            Na--;
            b.monitorRunDependencies && b.monitorRunDependencies(Na);
            if (0 == Na && (null !== Oa && (clearInterval(Oa), Oa = null), Pa)) {
                var a = Pa;
                Pa = null;
                a()
            }
        }
        function n(a) {
            if (b.onAbort)
                b.onAbort(a);
            a = "Aborted(" + a + ")";
            pa(a);
            ua = !0;
            a = new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
            ba(a);
            throw a;
        }
        function Sa() {
            return z.startsWith("data:application/octet-stream;base64,")
        }
        var z;
        z = "tesseract-core-simd.wasm";
        if (!Sa()) {
            var Ta = z;
            z = b.locateFile ? b.locateFile(Ta, f) : f + Ta
        }
        function Ua() {
            var a = z;
            try {
                if (a == z && sa)
                    return new Uint8Array(sa);
                if (la)
                    return la(a);
                throw "both async and sync fetching of the wasm failed";
            } catch (c) {
                n(c)
            }
        }
        function Va() {
            if (!sa && (fa || ha)) {
                if ("function" == typeof fetch && !z.startsWith("file://"))
                    return fetch(z, {
                        credentials: "same-origin"
                    }).then(function (a) {
                        if (!a.ok)
                            throw "failed to load wasm binary file at '" + z + "'";
                        return a.arrayBuffer()
                    }).catch(function () {
                        return Ua()
                    });
                if (ka)
                    return new Promise(function (a, c) {
                        ka(z, function (d) {
                            a(new Uint8Array(d))
                        }, c)
                    })
            }
            return Promise.resolve().then(function () {
                return Ua()
            })
        }
        var A,
        C,
        Wa = {
            627260: a => {
                b.TesseractProgress && b.TesseractProgress(a)
            },
            627329: a => {
                b.TesseractProgress && b.TesseractProgress(a)
            },
            627398: a => {
                b.TesseractProgress && b.TesseractProgress(a)
            }
        };
        function oa(a) {
            this.name = "ExitStatus";
            this.message = "Program terminated with exit(" + a + ")";
            this.status = a
        }
        function Xa(a) {
            for (; 0 < a.length; )
                a.shift()(b)
        }
        function Ya(a, c = "i8") {
            c.endsWith("*") && (c = "*");
            switch (c) {
            case "i1":
                return r[a >> 0];
            case "i8":
                return r[a >> 0];
            case "i16":
                return Ca[a >> 1];
            case "i32":
                return v[a >> 2];
            case "i64":
                return v[a >> 2];
            case "float":
                return Da[a >> 2];
            case "double":
                return Ea[a >> 3];
            case "*":
                return y[a >> 2];
            default:
                n("invalid type for getValue: " + c)
            }
            return null
        }
        function Za(a, c, d = "i8") {
            d.endsWith("*") && (d = "*");
            switch (d) {
            case "i1":
                r[a >> 0] = c;
                break;
            case "i8":
                r[a >> 0] = c;
                break;
            case "i16":
                Ca[a >> 1] = c;
                break;
            case "i32":
                v[a >> 2] = c;
                break;
            case "i64":
                C = [c >>> 0, (A = c, 1 <= +Math.abs(A) ? 0 < A ? (Math.min(+Math.floor(A / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((A -  + (~~A >>> 0)) / 4294967296) >>> 0 : 0)];
                v[a >> 2] = C[0];
                v[a + 4 >> 2] = C[1];
                break;
            case "float":
                Da[a >> 2] = c;
                break;
            case "double":
                Ea[a >> 3] = c;
                break;
            case "*":
                y[a >> 2] = c;
                break;
            default:
                n("invalid type for setValue: " + d)
            }
        }
        function $a(a) {
            this.If = a - 24;
            this.Ih = function (c) {
                y[this.If + 4 >> 2] = c
            };
            this.Eh = function (c) {
                y[this.If + 8 >> 2] = c
            };
            this.Fh = function () {
                v[this.If >> 2] = 0
            };
            this.Jg = function () {
                r[this.If + 12 >> 0] = 0
            };
            this.Hh = function () {
                r[this.If + 13 >> 0] = 0
            };
            this.rg = function (c, d) {
                this.Vf();
                this.Ih(c);
                this.Eh(d);
                this.Fh();
                this.Jg();
                this.Hh()
            };
            this.Vf = function () {
                y[this.If + 16 >> 2] = 0
            }
        }
        var ab = 0,
        bb = (a, c) => {
            for (var d = 0, e = a.length - 1; 0 <= e; e--) {
                var g = a[e];
                "." === g ? a.splice(e, 1) : ".." === g ? (a.splice(e, 1), d++) : d && (a.splice(e, 1), d--)
            }
            if (c)
                for (; d; d--)
                    a.unshift("..");
            return a
        },
        cb = a => {
            var c = "/" === a.charAt(0),
            d = "/" === a.substr(-1);
            (a = bb(a.split("/").filter(e => !!e), !c).join("/")) || c || (a = ".");
            a && d && (a += "/");
            return (c ? "/" : "") + a
        },
        db = a => {
            var c = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);
            a = c[0];
            c = c[1];
            if (!a && !c)
                return ".";
            c && (c = c.substr(0, c.length - 1));
            return a + c
        },
        eb =
            a => {
            if ("/" === a)
                return "/";
            a = cb(a);
            a = a.replace(/\/$/, "");
            var c = a.lastIndexOf("/");
            return -1 === c ? a : a.substr(c + 1)
        },
        fb = (a, c) => cb(a + "/" + c);
        function gb() {
            if ("object" == typeof crypto && "function" == typeof crypto.getRandomValues) {
                var a = new Uint8Array(1);
                return () => {
                    crypto.getRandomValues(a);
                    return a[0]
                }
            }
            if (ia)
                try {
                    var c = require("crypto");
                    return () => c.randomBytes(1)[0]
                } catch (d) {}
            return () => n("randomDevice")
        }
        function hb() {
            for (var a = "", c = !1, d = arguments.length - 1; -1 <= d && !c; d--) {
                c = 0 <= d ? arguments[d] : D.cwd();
                if ("string" != typeof c)
                    throw new TypeError("Arguments to path.resolve must be strings");
                if (!c)
                    return "";
                a = c + "/" + a;
                c = "/" === c.charAt(0)
            }
            a = bb(a.split("/").filter(e => !!e), !c).join("/");
            return (c ? "/" : "") + a || "."
        }
        var ib = (a, c) => {
            function d(k) {
                for (var m = 0; m < k.length && "" === k[m]; m++);
                for (var t = k.length - 1; 0 <= t && "" === k[t]; t--);
                return m > t ? [] : k.slice(m, t - m + 1)
            }
            a = hb(a).substr(1);
            c = hb(c).substr(1);
            a = d(a.split("/"));
            c = d(c.split("/"));
            for (var e = Math.min(a.length, c.length), g = e, h = 0; h < e; h++)
                if (a[h] !== c[h]) {
                    g = h;
                    break
                }
            e = [];
            for (h = g; h < a.length; h++)
                e.push("..");
            e = e.concat(c.slice(g));
            return e.join("/")
        };
        function jb(a, c) {
            var d = Array(Aa(a) + 1);
            a = za(a, d, 0, d.length);
            c && (d.length = a);
            return d
        }
        var kb = [];
        function lb(a, c) {
            kb[a] = {
                input: [],
                output: [],
                tg: c
            };
            D.gh(a, mb)
        }
        var mb = {
            open: function (a) {
                var c = kb[a.node.rdev];
                if (!c)
                    throw new D.Jf(43);
                a.tty = c;
                a.seekable = !1
            },
            close: function (a) {
                a.tty.tg.flush(a.tty)
            },
            flush: function (a) {
                a.tty.tg.flush(a.tty)
            },
            read: function (a, c, d, e) {
                if (!a.tty || !a.tty.tg.wh)
                    throw new D.Jf(60);
                for (var g = 0, h = 0; h < e; h++) {
                    try {
                        var k = a.tty.tg.wh(a.tty)
                    } catch (m) {
                        throw new D.Jf(29);
                    }
                    if (void 0 === k && 0 === g)
                        throw new D.Jf(6);
                    if (null === k || void 0 === k)
                        break;
                    g++;
                    c[d + h] = k
                }
                g && (a.node.timestamp = Date.now());
                return g
            },
            write: function (a, c, d, e) {
                if (!a.tty || !a.tty.tg.dh)
                    throw new D.Jf(60);
                try {
                    for (var g = 0; g < e; g++)
                        a.tty.tg.dh(a.tty, c[d + g])
                } catch (h) {
                    throw new D.Jf(29);
                }
                e && (a.node.timestamp = Date.now());
                return g
            }
        },
        nb = {
            wh: function (a) {
                if (!a.input.length) {
                    var c = null;
                    if (ia) {
                        var d = Buffer.alloc(256),
                        e = 0;
                        try {
                            e = fs.readSync(process.stdin.fd, d, 0, 256, -1)
                        } catch (g) {
                            if (g.toString().includes("EOF"))
                                e = 0;
                            else
                                throw g;
                        }
                        0 < e ? c = d.slice(0, e).toString("utf-8") : c = null
                    } else
                        "undefined" != typeof window && "function" == typeof window.prompt ? (c = window.prompt("Input: "), null !== c && (c += "\n")) : "function" == typeof readline &&
                        (c = readline(), null !== c && (c += "\n"));
                    if (!c)
                        return null;
                    a.input = jb(c, !0)
                }
                return a.input.shift()
            },
            dh: function (a, c) {
                null === c || 10 === c ? (qa(xa(a.output, 0)), a.output = []) : 0 != c && a.output.push(c)
            },
            flush: function (a) {
                a.output && 0 < a.output.length && (qa(xa(a.output, 0)), a.output = [])
            }
        },
        ob = {
            dh: function (a, c) {
                null === c || 10 === c ? (pa(xa(a.output, 0)), a.output = []) : 0 != c && a.output.push(c)
            },
            flush: function (a) {
                a.output && 0 < a.output.length && (pa(xa(a.output, 0)), a.output = [])
            }
        };
        function pb(a) {
            a = 65536 * Math.ceil(a / 65536);
            var c = qb(65536, a);
            if (!c)
                return 0;
            ya.fill(0, c, c + a);
            return c
        }
        var E = {
            ag: null,
            Sf: function () {
                return E.createNode(null, "/", 16895, 0)
            },
            createNode: function (a, c, d, e) {
                if (D.ui(d) || D.isFIFO(d))
                    throw new D.Jf(63);
                E.ag || (E.ag = {
                        dir: {
                            node: {
                                Yf: E.Kf.Yf,
                                Uf: E.Kf.Uf,
                                lookup: E.Kf.lookup,
                                eg: E.Kf.eg,
                                rename: E.Kf.rename,
                                unlink: E.Kf.unlink,
                                rmdir: E.Kf.rmdir,
                                readdir: E.Kf.readdir,
                                symlink: E.Kf.symlink
                            },
                            stream: {
                                Zf: E.Mf.Zf
                            }
                        },
                        file: {
                            node: {
                                Yf: E.Kf.Yf,
                                Uf: E.Kf.Uf
                            },
                            stream: {
                                Zf: E.Mf.Zf,
                                read: E.Mf.read,
                                write: E.Mf.write,
                                vg: E.Mf.vg,
                                lg: E.Mf.lg,
                                sg: E.Mf.sg
                            }
                        },
                        link: {
                            node: {
                                Yf: E.Kf.Yf,
                                Uf: E.Kf.Uf,
                                readlink: E.Kf.readlink
                            },
                            stream: {}
                        },
                        mh: {
                            node: {
                                Yf: E.Kf.Yf,
                                Uf: E.Kf.Uf
                            },
                            stream: D.Oh
                        }
                    });
                d = D.createNode(a, c, d, e);
                D.Tf(d.mode) ? (d.Kf = E.ag.dir.node, d.Mf = E.ag.dir.stream, d.Lf = {}) : D.isFile(d.mode) ? (d.Kf = E.ag.file.node, d.Mf = E.ag.file.stream, d.Qf = 0, d.Lf = null) : D.yg(d.mode) ? (d.Kf = E.ag.link.node, d.Mf = E.ag.link.stream) : D.Cg(d.mode) && (d.Kf = E.ag.mh.node, d.Mf = E.ag.mh.stream);
                d.timestamp = Date.now();
                a && (a.Lf[c] = d, a.timestamp = d.timestamp);
                return d
            },
            Oi: function (a) {
                return a.Lf ? a.Lf.subarray ? a.Lf.subarray(0, a.Qf) : new Uint8Array(a.Lf) : new Uint8Array(0)
            },
            th: function (a, c) {
                var d = a.Lf ? a.Lf.length : 0;
                d >= c || (c = Math.max(c, d * (1048576 > d ? 2 : 1.125) >>> 0), 0 != d && (c = Math.max(c, 256)), d = a.Lf, a.Lf = new Uint8Array(c), 0 < a.Qf && a.Lf.set(d.subarray(0, a.Qf), 0))
            },
            Ei: function (a, c) {
                if (a.Qf != c)
                    if (0 == c)
                        a.Lf = null, a.Qf = 0;
                    else {
                        var d = a.Lf;
                        a.Lf = new Uint8Array(c);
                        d && a.Lf.set(d.subarray(0, Math.min(c, a.Qf)));
                        a.Qf = c
                    }
            },
            Kf: {
                Yf: function (a) {
                    var c = {};
                    c.dev = D.Cg(a.mode) ? a.id : 1;
                    c.ino = a.id;
                    c.mode = a.mode;
                    c.nlink = 1;
                    c.uid = 0;
                    c.gid = 0;
                    c.rdev = a.rdev;
                    D.Tf(a.mode) ? c.size = 4096 : D.isFile(a.mode) ? c.size = a.Qf :
                        D.yg(a.mode) ? c.size = a.link.length : c.size = 0;
                    c.atime = new Date(a.timestamp);
                    c.mtime = new Date(a.timestamp);
                    c.ctime = new Date(a.timestamp);
                    c.Lh = 4096;
                    c.blocks = Math.ceil(c.size / c.Lh);
                    return c
                },
                Uf: function (a, c) {
                    void 0 !== c.mode && (a.mode = c.mode);
                    void 0 !== c.timestamp && (a.timestamp = c.timestamp);
                    void 0 !== c.size && E.Ei(a, c.size)
                },
                lookup: function () {
                    throw D.Pg[44];
                },
                eg: function (a, c, d, e) {
                    return E.createNode(a, c, d, e)
                },
                rename: function (a, c, d) {
                    if (D.Tf(a.mode)) {
                        try {
                            var e = D.dg(c, d)
                        } catch (h) {}
                        if (e)
                            for (var g in e.Lf)
                                throw new D.Jf(55);
                    }
                    delete a.parent.Lf[a.name];
                    a.parent.timestamp = Date.now();
                    a.name = d;
                    c.Lf[d] = a;
                    c.timestamp = a.parent.timestamp;
                    a.parent = c
                },
                unlink: function (a, c) {
                    delete a.Lf[c];
                    a.timestamp = Date.now()
                },
                rmdir: function (a, c) {
                    var d = D.dg(a, c),
                    e;
                    for (e in d.Lf)
                        throw new D.Jf(55);
                    delete a.Lf[c];
                    a.timestamp = Date.now()
                },
                readdir: function (a) {
                    var c = [".", ".."],
                    d;
                    for (d in a.Lf)
                        a.Lf.hasOwnProperty(d) && c.push(d);
                    return c
                },
                symlink: function (a, c, d) {
                    a = E.createNode(a, c, 41471, 0);
                    a.link = d;
                    return a
                },
                readlink: function (a) {
                    if (!D.yg(a.mode))
                        throw new D.Jf(28);
                    return a.link
                }
            },
            Mf: {
                read: function (a, c, d, e, g) {
                    var h = a.node.Lf;
                    if (g >= a.node.Qf)
                        return 0;
                    a = Math.min(a.node.Qf - g, e);
                    if (8 < a && h.subarray)
                        c.set(h.subarray(g, g + a), d);
                    else
                        for (e = 0; e < a; e++)
                            c[d + e] = h[g + e];
                    return a
                },
                write: function (a, c, d, e, g, h) {
                    c.buffer === r.buffer && (h = !1);
                    if (!e)
                        return 0;
                    a = a.node;
                    a.timestamp = Date.now();
                    if (c.subarray && (!a.Lf || a.Lf.subarray)) {
                        if (h)
                            return a.Lf = c.subarray(d, d + e), a.Qf = e;
                        if (0 === a.Qf && 0 === g)
                            return a.Lf = c.slice(d, d + e), a.Qf = e;
                        if (g + e <= a.Qf)
                            return a.Lf.set(c.subarray(d, d + e), g), e
                    }
                    E.th(a, g +
                        e);
                    if (a.Lf.subarray && c.subarray)
                        a.Lf.set(c.subarray(d, d + e), g);
                    else
                        for (h = 0; h < e; h++)
                            a.Lf[g + h] = c[d + h];
                    a.Qf = Math.max(a.Qf, g + e);
                    return e
                },
                Zf: function (a, c, d) {
                    1 === d ? c += a.position : 2 === d && D.isFile(a.node.mode) && (c += a.node.Qf);
                    if (0 > c)
                        throw new D.Jf(28);
                    return c
                },
                vg: function (a, c, d) {
                    E.th(a.node, c + d);
                    a.node.Qf = Math.max(a.node.Qf, c + d)
                },
                lg: function (a, c, d, e, g) {
                    if (!D.isFile(a.node.mode))
                        throw new D.Jf(43);
                    a = a.node.Lf;
                    if (g & 2 || a.buffer !== Ba) {
                        if (0 < d || d + c < a.length)
                            a.subarray ? a = a.subarray(d, d + c) : a = Array.prototype.slice.call(a,
                                    d, d + c);
                        d = !0;
                        c = pb(c);
                        if (!c)
                            throw new D.Jf(48);
                        r.set(a, c)
                    } else
                        d = !1, c = a.byteOffset;
                    return {
                        If: c,
                        kh: d
                    }
                },
                sg: function (a, c, d, e, g) {
                    if (!D.isFile(a.node.mode))
                        throw new D.Jf(43);
                    if (g & 2)
                        return 0;
                    E.Mf.write(a, c, 0, e, d, !1);
                    return 0
                }
            }
        };
        function rb(a, c, d) {
            var e = "al " + a;
            ka(a, g => {
                g || n('Loading data file "' + a + '" failed (no arrayBuffer).');
                c(new Uint8Array(g));
                e && Ra(e)
            }, () => {
                if (d)
                    d();
                else
                    throw 'Loading data file "' + a + '" failed.';
            });
            e && Qa(e)
        }
        var D = {
            root: null,
            Ag: [],
            rh: {},
            streams: [],
            zi: 1,
            $f: null,
            qh: "/",
            Xg: !1,
            Ah: !0,
            Jf: null,
            Pg: {},
            Wh: null,
            Gg: 0,
            Pf: (a, c = {}) => {
                a = hb(D.cwd(), a);
                if (!a)
                    return {
                        path: "",
                        node: null
                    };
                c = Object.assign({
                    Ng: !0,
                    fh: 0
                }, c);
                if (8 < c.fh)
                    throw new D.Jf(32);
                a = bb(a.split("/").filter(k => !!k), !1);
                for (var d = D.root, e = "/", g = 0; g < a.length; g++) {
                    var h = g === a.length - 1;
                    if (h && c.parent)
                        break;
                    d = D.dg(d, a[g]);
                    e = cb(e + "/" + a[g]);
                    D.jg(d) && (!h || h && c.Ng) && (d = d.zg.root);
                    if (!h || c.Xf)
                        for (h = 0; D.yg(d.mode); )
                            if (d = D.readlink(e), e = hb(db(e), d), d = D.Pf(e, {
                                    fh: c.fh + 1
                                }).node,
                                40 < h++)
                                throw new D.Jf(32);
                }
                return {
                    path: e,
                    node: d
                }
            },
            fg: a => {
                for (var c; ; ) {
                    if (D.Dg(a))
                        return a = a.Sf.Bh, c ? "/" !== a[a.length - 1] ? a + "/" + c : a + c : a;
                    c = c ? a.name + "/" + c : a.name;
                    a = a.parent
                }
            },
            Wg: (a, c) => {
                for (var d = 0, e = 0; e < c.length; e++)
                    d = (d << 5) - d + c.charCodeAt(e) | 0;
                return (a + d >>> 0) % D.$f.length
            },
            yh: a => {
                var c = D.Wg(a.parent.id, a.name);
                a.mg = D.$f[c];
                D.$f[c] = a
            },
            zh: a => {
                var c = D.Wg(a.parent.id, a.name);
                if (D.$f[c] === a)
                    D.$f[c] = a.mg;
                else
                    for (c = D.$f[c]; c; ) {
                        if (c.mg === a) {
                            c.mg = a.mg;
                            break
                        }
                        c = c.mg
                    }
            },
            dg: (a, c) => {
                var d = D.wi(a);
                if (d)
                    throw new D.Jf(d,
                        a);
                for (d = D.$f[D.Wg(a.id, c)]; d; d = d.mg) {
                    var e = d.name;
                    if (d.parent.id === a.id && e === c)
                        return d
                }
                return D.lookup(a, c)
            },
            createNode: (a, c, d, e) => {
                a = new D.Dh(a, c, d, e);
                D.yh(a);
                return a
            },
            Mg: a => {
                D.zh(a)
            },
            Dg: a => a === a.parent,
            jg: a => !!a.zg,
            isFile: a => 32768 === (a & 61440),
            Tf: a => 16384 === (a & 61440),
            yg: a => 40960 === (a & 61440),
            Cg: a => 8192 === (a & 61440),
            ui: a => 24576 === (a & 61440),
            isFIFO: a => 4096 === (a & 61440),
            isSocket: a => 49152 === (a & 49152),
            Xh: {
                r: 0,
                "r+": 2,
                w: 577,
                "w+": 578,
                a: 1089,
                "a+": 1090
            },
            yi: a => {
                var c = D.Xh[a];
                if ("undefined" == typeof c)
                    throw Error("Unknown file open mode: " +
                        a);
                return c
            },
            uh: a => {
                var c = ["r", "w", "rw"][a & 3];
                a & 512 && (c += "w");
                return c
            },
            ng: (a, c) => {
                if (D.Ah)
                    return 0;
                if (!c.includes("r") || a.mode & 292) {
                    if (c.includes("w") && !(a.mode & 146) || c.includes("x") && !(a.mode & 73))
                        return 2
                } else
                    return 2;
                return 0
            },
            wi: a => {
                var c = D.ng(a, "x");
                return c ? c : a.Kf.lookup ? 0 : 2
            },
            bh: (a, c) => {
                try {
                    return D.dg(a, c),
                    20
                } catch (d) {}
                return D.ng(a, "wx")
            },
            Eg: (a, c, d) => {
                try {
                    var e = D.dg(a, c)
                } catch (g) {
                    return g.Rf
                }
                if (a = D.ng(a, "wx"))
                    return a;
                if (d) {
                    if (!D.Tf(e.mode))
                        return 54;
                    if (D.Dg(e) || D.fg(e) === D.cwd())
                        return 10
                } else if (D.Tf(e.mode))
                    return 31;
                return 0
            },
            xi: (a, c) => a ? D.yg(a.mode) ? 32 : D.Tf(a.mode) && ("r" !== D.uh(c) || c & 512) ? 31 : D.ng(a, D.uh(c)) : 44,
            Gh: 4096,
            Ai: (a = 0, c = D.Gh) => {
                for (; a <= c; a++)
                    if (!D.streams[a])
                        return a;
                throw new D.Jf(33);
            },
            gg: a => D.streams[a],
            ph: (a, c, d) => {
                D.Bg || (D.Bg = function () {
                    this.Vf = {}
                }, D.Bg.prototype = {}, Object.defineProperties(D.Bg.prototype, {
                        object: {
                            get: function () {
                                return this.node
                            },
                            set: function (e) {
                                this.node = e
                            }
                        },
                        flags: {
                            get: function () {
                                return this.Vf.flags
                            },
                            set: function (e) {
                                this.Vf.flags = e
                            }
                        },
                        position: {
                            get: function () {
                                return this.Vf.position
                            },
                            set: function (e) {
                                this.Vf.position = e
                            }
                        }
                    }));
                a = Object.assign(new D.Bg, a);
                c = D.Ai(c, d);
                a.fd = c;
                return D.streams[c] = a
            },
            Ph: a => {
                D.streams[a] = null
            },
            Oh: {
                open: a => {
                    a.Mf = D.Yh(a.node.rdev).Mf;
                    a.Mf.open && a.Mf.open(a)
                },
                Zf: () => {
                    throw new D.Jf(70);
                }
            },
            ah: a => a >> 8,
            Ri: a => a & 255,
            kg: (a, c) => a << 8 | c,
            gh: (a, c) => {
                D.rh[a] = {
                    Mf: c
                }
            },
            Yh: a => D.rh[a],
            vh: a => {
                var c = [];
                for (a = [a]; a.length; ) {
                    var d = a.pop();
                    c.push(d);
                    a.push.apply(a, d.Ag)
                }
                return c
            },
            Ch: (a, c) => {
                function d(k) {
                    D.Gg--;
                    return c(k)
                }
                function e(k) {
                    if (k) {
                        if (!e.Vh)
                            return e.Vh = !0, d(k)
                    } else ++h >=
                        g.length && d(null)
                }
                "function" == typeof a && (c = a, a = !1);
                D.Gg++;
                1 < D.Gg && pa("warning: " + D.Gg + " FS.syncfs operations in flight at once, probably just doing extra work");
                var g = D.vh(D.root.Sf),
                h = 0;
                g.forEach(k => {
                    if (!k.type.Ch)
                        return e(null);
                    k.type.Ch(k, a, e)
                })
            },
            Sf: (a, c, d) => {
                var e = "/" === d,
                g = !d;
                if (e && D.root)
                    throw new D.Jf(10);
                if (!e && !g) {
                    var h = D.Pf(d, {
                        Ng: !1
                    });
                    d = h.path;
                    h = h.node;
                    if (D.jg(h))
                        throw new D.Jf(10);
                    if (!D.Tf(h.mode))
                        throw new D.Jf(54);
                }
                c = {
                    type: a,
                    Ui: c,
                    Bh: d,
                    Ag: []
                };
                a = a.Sf(c);
                a.Sf = c;
                c.root = a;
                e ? D.root = a : h && (h.zg =
                            c, h.Sf && h.Sf.Ag.push(c));
                return a
            },
            Yi: a => {
                a = D.Pf(a, {
                    Ng: !1
                });
                if (!D.jg(a.node))
                    throw new D.Jf(28);
                a = a.node;
                var c = a.zg,
                d = D.vh(c);
                Object.keys(D.$f).forEach(e => {
                    for (e = D.$f[e]; e; ) {
                        var g = e.mg;
                        d.includes(e.Sf) && D.Mg(e);
                        e = g
                    }
                });
                a.zg = null;
                a.Sf.Ag.splice(a.Sf.Ag.indexOf(c), 1)
            },
            lookup: (a, c) => a.Kf.lookup(a, c),
            eg: (a, c, d) => {
                var e = D.Pf(a, {
                    parent: !0
                }).node;
                a = eb(a);
                if (!a || "." === a || ".." === a)
                    throw new D.Jf(28);
                var g = D.bh(e, a);
                if (g)
                    throw new D.Jf(g);
                if (!e.Kf.eg)
                    throw new D.Jf(63);
                return e.Kf.eg(e, a, c, d)
            },
            create: (a, c) =>
            D.eg(a, (void 0 !== c ? c : 438) & 4095 | 32768, 0),
            mkdir: (a, c) => D.eg(a, (void 0 !== c ? c : 511) & 1023 | 16384, 0),
            Si: (a, c) => {
                a = a.split("/");
                for (var d = "", e = 0; e < a.length; ++e)
                    if (a[e]) {
                        d += "/" + a[e];
                        try {
                            D.mkdir(d, c)
                        } catch (g) {
                            if (20 != g.Rf)
                                throw g;
                        }
                    }
            },
            Fg: (a, c, d) => {
                "undefined" == typeof d && (d = c, c = 438);
                return D.eg(a, c | 8192, d)
            },
            symlink: (a, c) => {
                if (!hb(a))
                    throw new D.Jf(44);
                var d = D.Pf(c, {
                    parent: !0
                }).node;
                if (!d)
                    throw new D.Jf(44);
                c = eb(c);
                var e = D.bh(d, c);
                if (e)
                    throw new D.Jf(e);
                if (!d.Kf.symlink)
                    throw new D.Jf(63);
                return d.Kf.symlink(d,
                    c, a)
            },
            rename: (a, c) => {
                var d = db(a),
                e = db(c),
                g = eb(a),
                h = eb(c);
                var k = D.Pf(a, {
                    parent: !0
                });
                var m = k.node;
                k = D.Pf(c, {
                    parent: !0
                });
                k = k.node;
                if (!m || !k)
                    throw new D.Jf(44);
                if (m.Sf !== k.Sf)
                    throw new D.Jf(75);
                var t = D.dg(m, g);
                a = ib(a, e);
                if ("." !== a.charAt(0))
                    throw new D.Jf(28);
                a = ib(c, d);
                if ("." !== a.charAt(0))
                    throw new D.Jf(55);
                try {
                    var u = D.dg(k, h)
                } catch (p) {}
                if (t !== u) {
                    c = D.Tf(t.mode);
                    if (g = D.Eg(m, g, c))
                        throw new D.Jf(g);
                    if (g = u ? D.Eg(k, h, c) : D.bh(k, h))
                        throw new D.Jf(g);
                    if (!m.Kf.rename)
                        throw new D.Jf(63);
                    if (D.jg(t) || u && D.jg(u))
                        throw new D.Jf(10);
                    if (k !== m && (g = D.ng(m, "w")))
                        throw new D.Jf(g);
                    D.zh(t);
                    try {
                        m.Kf.rename(t, k, h)
                    } catch (p) {
                        throw p;
                    } finally {
                        D.yh(t)
                    }
                }
            },
            rmdir: a => {
                var c = D.Pf(a, {
                    parent: !0
                }).node;
                a = eb(a);
                var d = D.dg(c, a),
                e = D.Eg(c, a, !0);
                if (e)
                    throw new D.Jf(e);
                if (!c.Kf.rmdir)
                    throw new D.Jf(63);
                if (D.jg(d))
                    throw new D.Jf(10);
                c.Kf.rmdir(c, a);
                D.Mg(d)
            },
            readdir: a => {
                a = D.Pf(a, {
                    Xf: !0
                }).node;
                if (!a.Kf.readdir)
                    throw new D.Jf(54);
                return a.Kf.readdir(a)
            },
            unlink: a => {
                var c = D.Pf(a, {
                    parent: !0
                }).node;
                if (!c)
                    throw new D.Jf(44);
                a = eb(a);
                var d = D.dg(c, a),
                e = D.Eg(c, a,
                        !1);
                if (e)
                    throw new D.Jf(e);
                if (!c.Kf.unlink)
                    throw new D.Jf(63);
                if (D.jg(d))
                    throw new D.Jf(10);
                c.Kf.unlink(c, a);
                D.Mg(d)
            },
            readlink: a => {
                a = D.Pf(a).node;
                if (!a)
                    throw new D.Jf(44);
                if (!a.Kf.readlink)
                    throw new D.Jf(28);
                return hb(D.fg(a.parent), a.Kf.readlink(a))
            },
            stat: (a, c) => {
                a = D.Pf(a, {
                    Xf: !c
                }).node;
                if (!a)
                    throw new D.Jf(44);
                if (!a.Kf.Yf)
                    throw new D.Jf(63);
                return a.Kf.Yf(a)
            },
            lstat: a => D.stat(a, !0),
            chmod: (a, c, d) => {
                a = "string" == typeof a ? D.Pf(a, {
                    Xf: !d
                }).node : a;
                if (!a.Kf.Uf)
                    throw new D.Jf(63);
                a.Kf.Uf(a, {
                    mode: c & 4095 | a.mode &
                    -4096,
                    timestamp: Date.now()
                })
            },
            lchmod: (a, c) => {
                D.chmod(a, c, !0)
            },
            fchmod: (a, c) => {
                a = D.gg(a);
                if (!a)
                    throw new D.Jf(8);
                D.chmod(a.node, c)
            },
            chown: (a, c, d, e) => {
                a = "string" == typeof a ? D.Pf(a, {
                    Xf: !e
                }).node : a;
                if (!a.Kf.Uf)
                    throw new D.Jf(63);
                a.Kf.Uf(a, {
                    timestamp: Date.now()
                })
            },
            lchown: (a, c, d) => {
                D.chown(a, c, d, !0)
            },
            fchown: (a, c, d) => {
                a = D.gg(a);
                if (!a)
                    throw new D.Jf(8);
                D.chown(a.node, c, d)
            },
            truncate: (a, c) => {
                if (0 > c)
                    throw new D.Jf(28);
                a = "string" == typeof a ? D.Pf(a, {
                    Xf: !0
                }).node : a;
                if (!a.Kf.Uf)
                    throw new D.Jf(63);
                if (D.Tf(a.mode))
                    throw new D.Jf(31);
                if (!D.isFile(a.mode))
                    throw new D.Jf(28);
                var d = D.ng(a, "w");
                if (d)
                    throw new D.Jf(d);
                a.Kf.Uf(a, {
                    size: c,
                    timestamp: Date.now()
                })
            },
            Ni: (a, c) => {
                a = D.gg(a);
                if (!a)
                    throw new D.Jf(8);
                if (0 === (a.flags & 2097155))
                    throw new D.Jf(28);
                D.truncate(a.node, c)
            },
            Zi: (a, c, d) => {
                a = D.Pf(a, {
                    Xf: !0
                }).node;
                a.Kf.Uf(a, {
                    timestamp: Math.max(c, d)
                })
            },
            open: (a, c, d) => {
                if ("" === a)
                    throw new D.Jf(44);
                c = "string" == typeof c ? D.yi(c) : c;
                d = c & 64 ? ("undefined" == typeof d ? 438 : d) & 4095 | 32768 : 0;
                if ("object" == typeof a)
                    var e = a;
                else {
                    a = cb(a);
                    try {
                        e = D.Pf(a, {
                            Xf: !(c & 131072)
                        }).node
                    } catch (h) {}
                }
                var g =
                    !1;
                if (c & 64)
                    if (e) {
                        if (c & 128)
                            throw new D.Jf(20);
                    } else
                        e = D.eg(a, d, 0), g = !0;
                if (!e)
                    throw new D.Jf(44);
                D.Cg(e.mode) && (c &= -513);
                if (c & 65536 && !D.Tf(e.mode))
                    throw new D.Jf(54);
                if (!g && (d = D.xi(e, c)))
                    throw new D.Jf(d);
                c & 512 && !g && D.truncate(e, 0);
                c &= -131713;
                e = D.ph({
                    node: e,
                    path: D.fg(e),
                    flags: c,
                    seekable: !0,
                    position: 0,
                    Mf: e.Mf,
                    Li: [],
                    error: !1
                });
                e.Mf.open && e.Mf.open(e);
                !b.logReadFiles || c & 1 || (D.eh || (D.eh = {}), a in D.eh || (D.eh[a] = 1));
                return e
            },
            close: a => {
                if (D.xg(a))
                    throw new D.Jf(8);
                a.Vg && (a.Vg = null);
                try {
                    a.Mf.close && a.Mf.close(a)
                } catch (c) {
                    throw c;
                } finally {
                    D.Ph(a.fd)
                }
                a.fd = null
            },
            xg: a => null === a.fd,
            Zf: (a, c, d) => {
                if (D.xg(a))
                    throw new D.Jf(8);
                if (!a.seekable || !a.Mf.Zf)
                    throw new D.Jf(70);
                if (0 != d && 1 != d && 2 != d)
                    throw new D.Jf(28);
                a.position = a.Mf.Zf(a, c, d);
                a.Li = [];
                return a.position
            },
            read: (a, c, d, e, g) => {
                if (0 > e || 0 > g)
                    throw new D.Jf(28);
                if (D.xg(a))
                    throw new D.Jf(8);
                if (1 === (a.flags & 2097155))
                    throw new D.Jf(8);
                if (D.Tf(a.node.mode))
                    throw new D.Jf(31);
                if (!a.Mf.read)
                    throw new D.Jf(28);
                var h = "undefined" != typeof g;
                if (!h)
                    g = a.position;
                else if (!a.seekable)
                    throw new D.Jf(70);
                c = a.Mf.read(a, c, d, e, g);
                h || (a.position += c);
                return c
            },
            write: (a, c, d, e, g, h) => {
                if (0 > e || 0 > g)
                    throw new D.Jf(28);
                if (D.xg(a))
                    throw new D.Jf(8);
                if (0 === (a.flags & 2097155))
                    throw new D.Jf(8);
                if (D.Tf(a.node.mode))
                    throw new D.Jf(31);
                if (!a.Mf.write)
                    throw new D.Jf(28);
                a.seekable && a.flags & 1024 && D.Zf(a, 0, 2);
                var k = "undefined" != typeof g;
                if (!k)
                    g = a.position;
                else if (!a.seekable)
                    throw new D.Jf(70);
                c = a.Mf.write(a, c, d, e, g, h);
                k || (a.position += c);
                return c
            },
            vg: (a, c, d) => {
                if (D.xg(a))
                    throw new D.Jf(8);
                if (0 > c || 0 >= d)
                    throw new D.Jf(28);
                if (0 === (a.flags & 2097155))
                    throw new D.Jf(8);
                if (!D.isFile(a.node.mode) && !D.Tf(a.node.mode))
                    throw new D.Jf(43);
                if (!a.Mf.vg)
                    throw new D.Jf(138);
                a.Mf.vg(a, c, d)
            },
            lg: (a, c, d, e, g) => {
                if (0 !== (e & 2) && 0 === (g & 2) && 2 !== (a.flags & 2097155))
                    throw new D.Jf(2);
                if (1 === (a.flags & 2097155))
                    throw new D.Jf(2);
                if (!a.Mf.lg)
                    throw new D.Jf(43);
                return a.Mf.lg(a, c, d, e, g)
            },
            sg: (a, c, d, e, g) => a && a.Mf.sg ? a.Mf.sg(a, c, d, e, g) : 0,
            Ti: () => 0,
            Yg: (a, c, d) => {
                if (!a.Mf.Yg)
                    throw new D.Jf(59);
                return a.Mf.Yg(a, c, d)
            },
            readFile: (a, c = {}) => {
                c.flags = c.flags || 0;
                c.encoding = c.encoding || "binary";
                if ("utf8" !== c.encoding && "binary" !== c.encoding)
                    throw Error('Invalid encoding type "' + c.encoding + '"');
                var d,
                e = D.open(a, c.flags);
                a = D.stat(a).size;
                var g = new Uint8Array(a);
                D.read(e, g, 0, a, 0);
                "utf8" === c.encoding ? d = xa(g, 0) : "binary" === c.encoding && (d = g);
                D.close(e);
                return d
            },
            writeFile: (a, c, d = {}) => {
                d.flags = d.flags || 577;
                a = D.open(a, d.flags, d.mode);
                if ("string" == typeof c) {
                    var e = new Uint8Array(Aa(c) + 1);
                    c = za(c, e, 0, e.length);
                    D.write(a, e, 0, c, void 0, d.Nh)
                } else if (ArrayBuffer.isView(c))
                    D.write(a,
                        c, 0, c.byteLength, void 0, d.Nh);
                else
                    throw Error("Unsupported data type");
                D.close(a)
            },
            cwd: () => D.qh,
            chdir: a => {
                a = D.Pf(a, {
                    Xf: !0
                });
                if (null === a.node)
                    throw new D.Jf(44);
                if (!D.Tf(a.node.mode))
                    throw new D.Jf(54);
                var c = D.ng(a.node, "x");
                if (c)
                    throw new D.Jf(c);
                D.qh = a.path
            },
            Rh: () => {
                D.mkdir("/tmp");
                D.mkdir("/home");
                D.mkdir("/home/web_user")
            },
            Qh: () => {
                D.mkdir("/dev");
                D.gh(D.kg(1, 3), {
                    read: () => 0,
                    write: (c, d, e, g) => g
                });
                D.Fg("/dev/null", D.kg(1, 3));
                lb(D.kg(5, 0), nb);
                lb(D.kg(6, 0), ob);
                D.Fg("/dev/tty", D.kg(5, 0));
                D.Fg("/dev/tty1",
                    D.kg(6, 0));
                var a = gb();
                D.Wf("/dev", "random", a);
                D.Wf("/dev", "urandom", a);
                D.mkdir("/dev/shm");
                D.mkdir("/dev/shm/tmp")
            },
            Th: () => {
                D.mkdir("/proc");
                var a = D.mkdir("/proc/self");
                D.mkdir("/proc/self/fd");
                D.Sf({
                    Sf: () => {
                        var c = D.createNode(a, "fd", 16895, 73);
                        c.Kf = {
                            lookup: (d, e) => {
                                var g = D.gg(+e);
                                if (!g)
                                    throw new D.Jf(8);
                                d = {
                                    parent: null,
                                    Sf: {
                                        Bh: "fake"
                                    },
                                    Kf: {
                                        readlink: () => g.path
                                    }
                                };
                                return d.parent = d
                            }
                        };
                        return c
                    }
                }, {}, "/proc/self/fd")
            },
            Uh: () => {
                b.stdin ? D.Wf("/dev", "stdin", b.stdin) : D.symlink("/dev/tty", "/dev/stdin");
                b.stdout ?
                D.Wf("/dev", "stdout", null, b.stdout) : D.symlink("/dev/tty", "/dev/stdout");
                b.stderr ? D.Wf("/dev", "stderr", null, b.stderr) : D.symlink("/dev/tty1", "/dev/stderr");
                D.open("/dev/stdin", 0);
                D.open("/dev/stdout", 1);
                D.open("/dev/stderr", 1)
            },
            sh: () => {
                D.Jf || (D.Jf = function (a, c) {
                    this.node = c;
                    this.Fi = function (d) {
                        this.Rf = d
                    };
                    this.Fi(a);
                    this.message = "FS error"
                }, D.Jf.prototype = Error(), D.Jf.prototype.constructor = D.Jf, [44].forEach(a => {
                        D.Pg[a] = new D.Jf(a);
                        D.Pg[a].stack = "<generic error, no stack>"
                    }))
            },
            Gi: () => {
                D.sh();
                D.$f = Array(4096);
                D.Sf(E, {}, "/");
                D.Rh();
                D.Qh();
                D.Th();
                D.Wh = {
                    MEMFS: E
                }
            },
            rg: (a, c, d) => {
                D.rg.Xg = !0;
                D.sh();
                b.stdin = a || b.stdin;
                b.stdout = c || b.stdout;
                b.stderr = d || b.stderr;
                D.Uh()
            },
            Vi: () => {
                D.rg.Xg = !1;
                for (var a = 0; a < D.streams.length; a++) {
                    var c = D.streams[a];
                    c && D.close(c)
                }
            },
            Qg: (a, c) => {
                var d = 0;
                a && (d |= 365);
                c && (d |= 146);
                return d
            },
            Mi: (a, c) => {
                a = D.Kg(a, c);
                return a.exists ? a.object : null
            },
            Kg: (a, c) => {
                try {
                    var d = D.Pf(a, {
                        Xf: !c
                    });
                    a = d.path
                } catch (g) {}
                var e = {
                    Dg: !1,
                    exists: !1,
                    error: 0,
                    name: null,
                    path: null,
                    object: null,
                    Bi: !1,
                    Di: null,
                    Ci: null
                };
                try {
                    d = D.Pf(a, {
                        parent: !0
                    }),
                    e.Bi = !0,
                    e.Di = d.path,
                    e.Ci = d.node,
                    e.name = eb(a),
                    d = D.Pf(a, {
                        Xf: !c
                    }),
                    e.exists = !0,
                    e.path = d.path,
                    e.object = d.node,
                    e.name = d.node.name,
                    e.Dg = "/" === d.path
                } catch (g) {
                    e.error = g.Rf
                }
                return e
            },
            Lg: (a, c) => {
                a = "string" == typeof a ? a : D.fg(a);
                for (c = c.split("/").reverse(); c.length; ) {
                    var d = c.pop();
                    if (d) {
                        var e = cb(a + "/" + d);
                        try {
                            D.mkdir(e)
                        } catch (g) {}
                        a = e
                    }
                }
                return e
            },
            Sh: (a, c, d, e, g) => {
                a = "string" == typeof a ? a : D.fg(a);
                c = cb(a + "/" + c);
                return D.create(c, D.Qg(e, g))
            },
            wg: (a, c, d, e, g, h) => {
                var k = c;
                a && (a = "string" == typeof a ? a : D.fg(a),
                    k = c ? cb(a + "/" + c) : a);
                a = D.Qg(e, g);
                k = D.create(k, a);
                if (d) {
                    if ("string" == typeof d) {
                        c = Array(d.length);
                        e = 0;
                        for (g = d.length; e < g; ++e)
                            c[e] = d.charCodeAt(e);
                        d = c
                    }
                    D.chmod(k, a | 146);
                    c = D.open(k, 577);
                    D.write(c, d, 0, d.length, 0, h);
                    D.close(c);
                    D.chmod(k, a)
                }
                return k
            },
            Wf: (a, c, d, e) => {
                a = fb("string" == typeof a ? a : D.fg(a), c);
                c = D.Qg(!!d, !!e);
                D.Wf.ah || (D.Wf.ah = 64);
                var g = D.kg(D.Wf.ah++, 0);
                D.gh(g, {
                    open: h => {
                        h.seekable = !1
                    },
                    close: () => {
                        e && e.buffer && e.buffer.length && e(10)
                    },
                    read: (h, k, m, t) => {
                        for (var u = 0, p = 0; p < t; p++) {
                            try {
                                var x = d()
                            } catch (N) {
                                throw new D.Jf(29);
                            }
                            if (void 0 === x && 0 === u)
                                throw new D.Jf(6);
                            if (null === x || void 0 === x)
                                break;
                            u++;
                            k[m + p] = x
                        }
                        u && (h.node.timestamp = Date.now());
                        return u
                    },
                    write: (h, k, m, t) => {
                        for (var u = 0; u < t; u++)
                            try {
                                e(k[m + u])
                            } catch (p) {
                                throw new D.Jf(29);
                            }
                        t && (h.node.timestamp = Date.now());
                        return u
                    }
                });
                return D.Fg(a, c, g)
            },
            Og: a => {
                if (a.Zg || a.vi || a.link || a.Lf)
                    return !0;
                if ("undefined" != typeof XMLHttpRequest)
                    throw Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
                if (ja)
                    try {
                        a.Lf = jb(ja(a.url), !0),
                        a.Qf = a.Lf.length
                    } catch (c) {
                        throw new D.Jf(29);
                    }
                else
                    throw Error("Cannot load without read() or XMLHttpRequest.");
            },
            nh: (a, c, d, e, g) => {
                function h() {
                    this.$g = !1;
                    this.Vf = []
                }
                function k(p, x, N, l, w) {
                    p = p.node.Lf;
                    if (w >= p.length)
                        return 0;
                    l = Math.min(p.length - w, l);
                    if (p.slice)
                        for (var B = 0; B < l; B++)
                            x[N + B] = p[w + B];
                    else
                        for (B = 0; B < l; B++)
                            x[N + B] = p.get(w + B);
                    return l
                }
                h.prototype.get = function (p) {
                    if (!(p > this.length - 1 || 0 > p)) {
                        var x = p % this.chunkSize;
                        return this.xh(p / this.chunkSize | 0)[x]
                    }
                };
                h.prototype.Jg =
                function (p) {
                    this.xh = p
                };
                h.prototype.lh = function () {
                    var p = new XMLHttpRequest;
                    p.open("HEAD", d, !1);
                    p.send(null);
                    if (!(200 <= p.status && 300 > p.status || 304 === p.status))
                        throw Error("Couldn't load " + d + ". Status: " + p.status);
                    var x = Number(p.getResponseHeader("Content-length")),
                    N,
                    l = (N = p.getResponseHeader("Accept-Ranges")) && "bytes" === N;
                    p = (N = p.getResponseHeader("Content-Encoding")) && "gzip" === N;
                    var w = 1048576;
                    l || (w = x);
                    var B = this;
                    B.Jg(U => {
                        var va = U * w,
                        Ja = (U + 1) * w - 1;
                        Ja = Math.min(Ja, x - 1);
                        if ("undefined" == typeof B.Vf[U]) {
                            var Sh =
                                B.Vf;
                            if (va > Ja)
                                throw Error("invalid range (" + va + ", " + Ja + ") or no bytes requested!");
                            if (Ja > x - 1)
                                throw Error("only " + x + " bytes available! programmer error!");
                            var W = new XMLHttpRequest;
                            W.open("GET", d, !1);
                            x !== w && W.setRequestHeader("Range", "bytes=" + va + "-" + Ja);
                            W.responseType = "arraybuffer";
                            W.overrideMimeType && W.overrideMimeType("text/plain; charset=x-user-defined");
                            W.send(null);
                            if (!(200 <= W.status && 300 > W.status || 304 === W.status))
                                throw Error("Couldn't load " + d + ". Status: " + W.status);
                            va = void 0 !== W.response ? new Uint8Array(W.response ||
                                    []) : jb(W.responseText || "", !0);
                            Sh[U] = va
                        }
                        if ("undefined" == typeof B.Vf[U])
                            throw Error("doXHR failed!");
                        return B.Vf[U]
                    });
                    if (p || !x)
                        w = x = 1, w = x = this.xh(0).length, qa("LazyFiles on gzip forces download of the whole file when length is accessed");
                    this.Kh = x;
                    this.Jh = w;
                    this.$g = !0
                };
                if ("undefined" != typeof XMLHttpRequest) {
                    if (!ha)
                        throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
                    var m = new h;
                    Object.defineProperties(m, {
                        length: {
                            get: function () {
                                this.$g ||
                                this.lh();
                                return this.Kh
                            }
                        },
                        chunkSize: {
                            get: function () {
                                this.$g || this.lh();
                                return this.Jh
                            }
                        }
                    });
                    m = {
                        Zg: !1,
                        Lf: m
                    }
                } else
                    m = {
                        Zg: !1,
                        url: d
                    };
                var t = D.Sh(a, c, m, e, g);
                m.Lf ? t.Lf = m.Lf : m.url && (t.Lf = null, t.url = m.url);
                Object.defineProperties(t, {
                    Qf: {
                        get: function () {
                            return this.Lf.length
                        }
                    }
                });
                var u = {};
                Object.keys(t.Mf).forEach(p => {
                    var x = t.Mf[p];
                    u[p] = function () {
                        D.Og(t);
                        return x.apply(null, arguments)
                    }
                });
                u.read = (p, x, N, l, w) => {
                    D.Og(t);
                    return k(p, x, N, l, w)
                };
                u.lg = (p, x, N) => {
                    D.Og(t);
                    var l = pb(x);
                    if (!l)
                        throw new D.Jf(48);
                    k(p, r, l, x, N);
                    return {
                        If: l,
                        kh: !0
                    }
                };
                t.Mf = u;
                return t
            },
            oh: (a, c, d, e, g, h, k, m, t, u) => {
                function p(l) {
                    function w(B) {
                        u && u();
                        m || D.wg(a, c, B, e, g, t);
                        h && h();
                        Ra(N)
                    }
                    sb.Pi(l, x, w, () => {
                        k && k();
                        Ra(N)
                    }) || w(l)
                }
                var x = c ? hb(cb(a + "/" + c)) : a,
                N = "cp " + x;
                Qa(N);
                "string" == typeof d ? rb(d, l => p(l), k) : p(d)
            },
            indexedDB: () => window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
            ih: () => "EM_FS_" + window.location.pathname,
            jh: 20,
            ug: "FILE_DATA",
            Wi: (a, c, d) => {
                c = c || (() => {});
                d = d || (() => {});
                var e = D.indexedDB();
                try {
                    var g = e.open(D.ih(), D.jh)
                } catch (h) {
                    return d(h)
                }
                g.onupgradeneeded =
                    () => {
                    qa("creating db");
                    g.result.createObjectStore(D.ug)
                };
                g.onsuccess = () => {
                    var h = g.result.transaction([D.ug], "readwrite"),
                    k = h.objectStore(D.ug),
                    m = 0,
                    t = 0,
                    u = a.length;
                    a.forEach(p => {
                        p = k.put(D.Kg(p).object.Lf, p);
                        p.onsuccess = () => {
                            m++;
                            m + t == u && (0 == t ? c() : d())
                        };
                        p.onerror = () => {
                            t++;
                            m + t == u && (0 == t ? c() : d())
                        }
                    });
                    h.onerror = d
                };
                g.onerror = d
            },
            Qi: (a, c, d) => {
                c = c || (() => {});
                d = d || (() => {});
                var e = D.indexedDB();
                try {
                    var g = e.open(D.ih(), D.jh)
                } catch (h) {
                    return d(h)
                }
                g.onupgradeneeded = d;
                g.onsuccess = () => {
                    var h = g.result;
                    try {
                        var k = h.transaction([D.ug],
                                "readonly")
                    } catch (x) {
                        d(x);
                        return
                    }
                    var m = k.objectStore(D.ug),
                    t = 0,
                    u = 0,
                    p = a.length;
                    a.forEach(x => {
                        var N = m.get(x);
                        N.onsuccess = () => {
                            D.Kg(x).exists && D.unlink(x);
                            D.wg(db(x), eb(x), N.result, !0, !0, !0);
                            t++;
                            t + u == p && (0 == u ? c() : d())
                        };
                        N.onerror = () => {
                            u++;
                            t + u == p && (0 == u ? c() : d())
                        }
                    });
                    k.onerror = d
                };
                g.onerror = d
            }
        };
        function tb(a, c, d) {
            if ("/" === c.charAt(0))
                return c;
            if (-100 === a)
                a = D.cwd();
            else {
                a = D.gg(a);
                if (!a)
                    throw new D.Jf(8);
                a = a.path
            }
            if (0 == c.length) {
                if (!d)
                    throw new D.Jf(44);
                return a
            }
            return cb(a + "/" + c)
        }
        function ub(a, c, d) {
            try {
                var e = a(c)
            } catch (g) {
                if (g && g.node && cb(c) !== cb(D.fg(g.node)))
                    return -54;
                throw g;
            }
            v[d >> 2] = e.dev;
            v[d + 8 >> 2] = e.ino;
            v[d + 12 >> 2] = e.mode;
            v[d + 16 >> 2] = e.nlink;
            v[d + 20 >> 2] = e.uid;
            v[d + 24 >> 2] = e.gid;
            v[d + 28 >> 2] = e.rdev;
            C = [e.size >>> 0, (A = e.size, 1 <= +Math.abs(A) ? 0 < A ? (Math.min(+Math.floor(A / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((A -  + (~~A >>> 0)) / 4294967296) >>> 0 : 0)];
            v[d + 40 >> 2] = C[0];
            v[d + 44 >> 2] = C[1];
            v[d + 48 >> 2] = 4096;
            v[d + 52 >> 2] = e.blocks;
            C = [Math.floor(e.atime.getTime() / 1E3) >>> 0, (A = Math.floor(e.atime.getTime() /
                            1E3), 1 <= +Math.abs(A) ? 0 < A ? (Math.min(+Math.floor(A / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((A -  + (~~A >>> 0)) / 4294967296) >>> 0 : 0)];
            v[d + 56 >> 2] = C[0];
            v[d + 60 >> 2] = C[1];
            v[d + 64 >> 2] = 0;
            C = [Math.floor(e.mtime.getTime() / 1E3) >>> 0, (A = Math.floor(e.mtime.getTime() / 1E3), 1 <= +Math.abs(A) ? 0 < A ? (Math.min(+Math.floor(A / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((A -  + (~~A >>> 0)) / 4294967296) >>> 0 : 0)];
            v[d + 72 >> 2] = C[0];
            v[d + 76 >> 2] = C[1];
            v[d + 80 >> 2] = 0;
            C = [Math.floor(e.ctime.getTime() / 1E3) >>> 0, (A = Math.floor(e.ctime.getTime() / 1E3), 1 <= +Math.abs(A) ?
                    0 < A ? (Math.min(+Math.floor(A / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((A -  + (~~A >>> 0)) / 4294967296) >>> 0 : 0)];
            v[d + 88 >> 2] = C[0];
            v[d + 92 >> 2] = C[1];
            v[d + 96 >> 2] = 0;
            C = [e.ino >>> 0, (A = e.ino, 1 <= +Math.abs(A) ? 0 < A ? (Math.min(+Math.floor(A / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((A -  + (~~A >>> 0)) / 4294967296) >>> 0 : 0)];
            v[d + 104 >> 2] = C[0];
            v[d + 108 >> 2] = C[1];
            return 0
        }
        var vb = void 0;
        function wb() {
            vb += 4;
            return v[vb - 4 >> 2]
        }
        function xb(a) {
            a = D.gg(a);
            if (!a)
                throw new D.Jf(8);
            return a
        }
        function yb(a) {
            var c = Aa(a) + 1,
            d = zb(c);
            d && za(a, r, d, c);
            return d
        }
        function Ab(a, c, d) {
            function e(t) {
                return (t = t.toTimeString().match(/\(([A-Za-z ]+)\)$/)) ? t[1] : "GMT"
            }
            var g = (new Date).getFullYear(),
            h = new Date(g, 0, 1),
            k = new Date(g, 6, 1);
            g = h.getTimezoneOffset();
            var m = k.getTimezoneOffset();
            v[a >> 2] = 60 * Math.max(g, m);
            v[c >> 2] = Number(g != m);
            a = e(h);
            c = e(k);
            a = yb(a);
            c = yb(c);
            m < g ? (y[d >> 2] = a, y[d + 4 >> 2] = c) : (y[d >> 2] = c, y[d + 4 >> 2] = a)
        }
        function Bb(a, c, d) {
            Bb.Mh || (Bb.Mh = !0, Ab(a, c, d))
        }
        var Cb = [],
        Db;
        Db = ia ? () => {
            var a = process.hrtime();
            return 1E3 * a[0] + a[1] / 1E6
        }
         : () => performance.now();
        var Eb = {};
        function Fb() {
            if (!Gb) {
                var a = {
                    USER: "web_user",
                    LOGNAME: "web_user",
                    PATH: "/",
                    PWD: "/",
                    HOME: "/home/web_user",
                    LANG: ("object" == typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8",
                    _: da || "./this.program"
                },
                c;
                for (c in Eb)
                    void 0 === Eb[c] ? delete a[c] : a[c] = Eb[c];
                var d = [];
                for (c in a)
                    d.push(c + "=" + a[c]);
                Gb = d
            }
            return Gb
        }
        var Gb;
        function Hb(a) {
            return 0 === a % 4 && (0 !== a % 100 || 0 === a % 400)
        }
        var Ib = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        Jb = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        function Kb(a, c, d, e) {
            function g(l, w, B) {
                for (l = "number" == typeof l ? l.toString() : l || ""; l.length < w; )
                    l = B[0] + l;
                return l
            }
            function h(l, w) {
                return g(l, w, "0")
            }
            function k(l, w) {
                function B(va) {
                    return 0 > va ? -1 : 0 < va ? 1 : 0
                }
                var U;
                0 === (U = B(l.getFullYear() - w.getFullYear())) && 0 === (U = B(l.getMonth() - w.getMonth())) && (U = B(l.getDate() - w.getDate()));
                return U
            }
            function m(l) {
                switch (l.getDay()) {
                case 0:
                    return new Date(l.getFullYear() - 1, 11, 29);
                case 1:
                    return l;
                case 2:
                    return new Date(l.getFullYear(), 0, 3);
                case 3:
                    return new Date(l.getFullYear(),
                        0, 2);
                case 4:
                    return new Date(l.getFullYear(), 0, 1);
                case 5:
                    return new Date(l.getFullYear() - 1, 11, 31);
                case 6:
                    return new Date(l.getFullYear() - 1, 11, 30)
                }
            }
            function t(l) {
                var w = l.pg;
                for (l = new Date((new Date(l.qg + 1900, 0, 1)).getTime()); 0 < w; ) {
                    var B = l.getMonth(),
                    U = (Hb(l.getFullYear()) ? Ib : Jb)[B];
                    if (w > U - l.getDate())
                        w -= U - l.getDate() + 1, l.setDate(1), 11 > B ? l.setMonth(B + 1) : (l.setMonth(0), l.setFullYear(l.getFullYear() + 1));
                    else {
                        l.setDate(l.getDate() + w);
                        break
                    }
                }
                B = new Date(l.getFullYear() + 1, 0, 4);
                w = m(new Date(l.getFullYear(),
                            0, 4));
                B = m(B);
                return 0 >= k(w, l) ? 0 >= k(B, l) ? l.getFullYear() + 1 : l.getFullYear() : l.getFullYear() - 1
            }
            var u = v[e + 40 >> 2];
            e = {
                Ji: v[e >> 2],
                Ii: v[e + 4 >> 2],
                Hg: v[e + 8 >> 2],
                hh: v[e + 12 >> 2],
                Ig: v[e + 16 >> 2],
                qg: v[e + 20 >> 2],
                bg: v[e + 24 >> 2],
                pg: v[e + 28 >> 2],
                Xi: v[e + 32 >> 2],
                Hi: v[e + 36 >> 2],
                Ki: u ? q(u) : ""
            };
            d = q(d);
            u = {
                "%c": "%a %b %d %H:%M:%S %Y",
                "%D": "%m/%d/%y",
                "%F": "%Y-%m-%d",
                "%h": "%b",
                "%r": "%I:%M:%S %p",
                "%R": "%H:%M",
                "%T": "%H:%M:%S",
                "%x": "%m/%d/%y",
                "%X": "%H:%M:%S",
                "%Ec": "%c",
                "%EC": "%C",
                "%Ex": "%m/%d/%y",
                "%EX": "%H:%M:%S",
                "%Ey": "%y",
                "%EY": "%Y",
                "%Od": "%d",
                "%Oe": "%e",
                "%OH": "%H",
                "%OI": "%I",
                "%Om": "%m",
                "%OM": "%M",
                "%OS": "%S",
                "%Ou": "%u",
                "%OU": "%U",
                "%OV": "%V",
                "%Ow": "%w",
                "%OW": "%W",
                "%Oy": "%y"
            };
            for (var p in u)
                d = d.replace(new RegExp(p, "g"), u[p]);
            var x = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
            N = "January February March April May June July August September October November December".split(" ");
            u = {
                "%a": function (l) {
                    return x[l.bg].substring(0, 3)
                },
                "%A": function (l) {
                    return x[l.bg]
                },
                "%b": function (l) {
                    return N[l.Ig].substring(0, 3)
                },
                "%B": function (l) {
                    return N[l.Ig]
                },
                "%C": function (l) {
                    return h((l.qg + 1900) / 100 | 0, 2)
                },
                "%d": function (l) {
                    return h(l.hh, 2)
                },
                "%e": function (l) {
                    return g(l.hh, 2, " ")
                },
                "%g": function (l) {
                    return t(l).toString().substring(2)
                },
                "%G": function (l) {
                    return t(l)
                },
                "%H": function (l) {
                    return h(l.Hg, 2)
                },
                "%I": function (l) {
                    l = l.Hg;
                    0 == l ? l = 12 : 12 < l && (l -= 12);
                    return h(l, 2)
                },
                "%j": function (l) {
                    for (var w = 0, B = 0; B <= l.Ig - 1; w += (Hb(l.qg + 1900) ? Ib : Jb)[B++]);
                    return h(l.hh + w, 3)
                },
                "%m": function (l) {
                    return h(l.Ig + 1, 2)
                },
                "%M": function (l) {
                    return h(l.Ii, 2)
                },
                "%n": function () {
                    return "\n"
                },
                "%p": function (l) {
                    return 0 <=
                    l.Hg && 12 > l.Hg ? "AM" : "PM"
                },
                "%S": function (l) {
                    return h(l.Ji, 2)
                },
                "%t": function () {
                    return "\t"
                },
                "%u": function (l) {
                    return l.bg || 7
                },
                "%U": function (l) {
                    return h(Math.floor((l.pg + 7 - l.bg) / 7), 2)
                },
                "%V": function (l) {
                    var w = Math.floor((l.pg + 7 - (l.bg + 6) % 7) / 7);
                    2 >= (l.bg + 371 - l.pg - 2) % 7 && w++;
                    if (w)
                        53 == w && (B = (l.bg + 371 - l.pg) % 7, 4 == B || 3 == B && Hb(l.qg) || (w = 1));
                    else {
                        w = 52;
                        var B = (l.bg + 7 - l.pg - 1) % 7;
                        (4 == B || 5 == B && Hb(l.qg % 400 - 1)) && w++
                    }
                    return h(w, 2)
                },
                "%w": function (l) {
                    return l.bg
                },
                "%W": function (l) {
                    return h(Math.floor((l.pg + 7 - (l.bg + 6) % 7) / 7), 2)
                },
                "%y": function (l) {
                    return (l.qg + 1900).toString().substring(2)
                },
                "%Y": function (l) {
                    return l.qg + 1900
                },
                "%z": function (l) {
                    l = l.Hi;
                    var w = 0 <= l;
                    l = Math.abs(l) / 60;
                    return (w ? "+" : "-") + String("0000" + (l / 60 * 100 + l % 60)).slice(-4)
                },
                "%Z": function (l) {
                    return l.Ki
                },
                "%%": function () {
                    return "%"
                }
            };
            d = d.replace(/%%/g, "\x00\x00");
            for (p in u)
                d.includes(p) && (d = d.replace(new RegExp(p, "g"), u[p](e)));
            d = d.replace(/\0\0/g, "%");
            p = jb(d, !1);
            if (p.length > c)
                return 0;
            r.set(p, a);
            return p.length - 1
        }
        var Lb = [];
        function Mb(a) {
            var c = Lb[a];
            c || (a >= Lb.length && (Lb.length = a + 1), Lb[a] = c = Ga.get(a));
            return c
        }
        function Nb(a, c, d, e) {
            a || (a = this);
            this.parent = a;
            this.Sf = a.Sf;
            this.zg = null;
            this.id = D.zi++;
            this.name = c;
            this.mode = d;
            this.Kf = {};
            this.Mf = {};
            this.rdev = e
        }
        Object.defineProperties(Nb.prototype, {
            read: {
                get: function () {
                    return 365 === (this.mode & 365)
                },
                set: function (a) {
                    a ? this.mode |= 365 : this.mode &= -366
                }
            },
            write: {
                get: function () {
                    return 146 === (this.mode & 146)
                },
                set: function (a) {
                    a ? this.mode |= 146 : this.mode &= -147
                }
            },
            vi: {
                get: function () {
                    return D.Tf(this.mode)
                }
            },
            Zg: {
                get: function () {
                    return D.Cg(this.mode)
                }
            }
        });
        D.Dh = Nb;
        D.Gi();
        var sb;
        b.FS_createPath = D.Lg;
        b.FS_createDataFile = D.wg;
        b.FS_createPreloadedFile = D.oh;
        b.FS_unlink = D.unlink;
        b.FS_createLazyFile = D.nh;
        b.FS_createDevice = D.Wf;
        var $b = {
            c: function (a, c, d, e) {
                n("Assertion failed: " + q(a) + ", at: " + [c ? q(c) : "unknown filename", d, e ? q(e) : "unknown function"])
            },
            q: function (a) {
                return zb(a + 24) + 24
            },
            p: function (a, c, d) {
                (new $a(a)).rg(c, d);
                ab++;
                throw a;
            },
            w: function (a, c, d) {
                vb = d;
                try {
                    var e = xb(a);
                    switch (c) {
                    case 0:
                        var g = wb();
                        return 0 > g ? -28 : D.ph(e, g).fd;
                    case 1:
                    case 2:
                        return 0;
                    case 3:
                        return e.flags;
                    case 4:
                        return g = wb(),
                        e.flags |= g,
                        0;
                    case 5:
                        return g = wb(),
                        Ca[g + 0 >> 1] = 2,
                        0;
                    case 6:
                    case 7:
                        return 0;
                    case 16:
                    case 8:
                        return -28;
                    case 9:
                        return v[Ob() >> 2] = 28,
                        -1;
                    default:
                        return -28
                    }
                } catch (h) {
                    if ("undefined" ==
                        typeof D || !(h instanceof D.Jf))
                        throw h;
                    return -h.Rf
                }
            },
            M: function (a, c) {
                try {
                    var d = xb(a);
                    return ub(D.stat, d.path, c)
                } catch (e) {
                    if ("undefined" == typeof D || !(e instanceof D.Jf))
                        throw e;
                    return -e.Rf
                }
            },
            J: function (a, c) {
                try {
                    if (0 === c)
                        return -28;
                    var d = D.cwd(),
                    e = Aa(d) + 1;
                    if (c < e)
                        return -68;
                    za(d, ya, a, c);
                    return e
                } catch (g) {
                    if ("undefined" == typeof D || !(g instanceof D.Jf))
                        throw g;
                    return -g.Rf
                }
            },
            U: function (a, c, d) {
                vb = d;
                try {
                    var e = xb(a);
                    switch (c) {
                    case 21509:
                    case 21505:
                        return e.tty ? 0 : -59;
                    case 21510:
                    case 21511:
                    case 21512:
                    case 21506:
                    case 21507:
                    case 21508:
                        return e.tty ?
                        0 : -59;
                    case 21519:
                        if (!e.tty)
                            return -59;
                        var g = wb();
                        return v[g >> 2] = 0;
                    case 21520:
                        return e.tty ? -28 : -59;
                    case 21531:
                        return g = wb(),
                        D.Yg(e, c, g);
                    case 21523:
                        return e.tty ? 0 : -59;
                    case 21524:
                        return e.tty ? 0 : -59;
                    default:
                        return -28
                    }
                } catch (h) {
                    if ("undefined" == typeof D || !(h instanceof D.Jf))
                        throw h;
                    return -h.Rf
                }
            },
            K: function (a, c, d, e) {
                try {
                    c = q(c);
                    var g = e & 256;
                    c = tb(a, c, e & 4096);
                    return ub(g ? D.lstat : D.stat, c, d)
                } catch (h) {
                    if ("undefined" == typeof D || !(h instanceof D.Jf))
                        throw h;
                    return -h.Rf
                }
            },
            u: function (a, c, d, e) {
                vb = e;
                try {
                    c = q(c);
                    c = tb(a,
                            c);
                    var g = e ? wb() : 0;
                    return D.open(c, d, g).fd
                } catch (h) {
                    if ("undefined" == typeof D || !(h instanceof D.Jf))
                        throw h;
                    return -h.Rf
                }
            },
            D: function (a) {
                try {
                    return a = q(a),
                    D.rmdir(a),
                    0
                } catch (c) {
                    if ("undefined" == typeof D || !(c instanceof D.Jf))
                        throw c;
                    return -c.Rf
                }
            },
            L: function (a, c) {
                try {
                    return a = q(a),
                    ub(D.stat, a, c)
                } catch (d) {
                    if ("undefined" == typeof D || !(d instanceof D.Jf))
                        throw d;
                    return -d.Rf
                }
            },
            E: function (a, c, d) {
                try {
                    return c = q(c),
                    c = tb(a, c),
                    0 === d ? D.unlink(c) : 512 === d ? D.rmdir(c) : n("Invalid flags passed to unlinkat"),
                    0
                } catch (e) {
                    if ("undefined" ==
                        typeof D || !(e instanceof D.Jf))
                        throw e;
                    return -e.Rf
                }
            },
            o: function () {
                return Date.now()
            },
            V: function (a) {
                do {
                    var c = y[a >> 2];
                    a += 4;
                    var d = y[a >> 2];
                    a += 4;
                    var e = y[a >> 2];
                    a += 4;
                    c = q(c);
                    D.Lg("/", db(c), !0, !0);
                    D.wg(c, null, r.subarray(e, e + d), !0, !0, !0)
                } while (y[a >> 2])
            },
            O: function () {
                return !0
            },
            B: function () {
                throw Infinity;
            },
            P: function (a, c) {
                a = new Date(1E3 * (y[a >> 2] + 4294967296 * v[a + 4 >> 2]));
                v[c >> 2] = a.getUTCSeconds();
                v[c + 4 >> 2] = a.getUTCMinutes();
                v[c + 8 >> 2] = a.getUTCHours();
                v[c + 12 >> 2] = a.getUTCDate();
                v[c + 16 >> 2] = a.getUTCMonth();
                v[c + 20 >>
                    2] = a.getUTCFullYear() - 1900;
                v[c + 24 >> 2] = a.getUTCDay();
                v[c + 28 >> 2] = (a.getTime() - Date.UTC(a.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) / 864E5 | 0
            },
            Q: function (a, c) {
                a = new Date(1E3 * (y[a >> 2] + 4294967296 * v[a + 4 >> 2]));
                v[c >> 2] = a.getSeconds();
                v[c + 4 >> 2] = a.getMinutes();
                v[c + 8 >> 2] = a.getHours();
                v[c + 12 >> 2] = a.getDate();
                v[c + 16 >> 2] = a.getMonth();
                v[c + 20 >> 2] = a.getFullYear() - 1900;
                v[c + 24 >> 2] = a.getDay();
                var d = new Date(a.getFullYear(), 0, 1);
                v[c + 28 >> 2] = (a.getTime() - d.getTime()) / 864E5 | 0;
                v[c + 36 >> 2] =  - (60 * a.getTimezoneOffset());
                var e = (new Date(a.getFullYear(),
                        6, 1)).getTimezoneOffset();
                d = d.getTimezoneOffset();
                v[c + 32 >> 2] = (e != d && a.getTimezoneOffset() == Math.min(d, e)) | 0
            },
            R: function (a) {
                var c = new Date(v[a + 20 >> 2] + 1900, v[a + 16 >> 2], v[a + 12 >> 2], v[a + 8 >> 2], v[a + 4 >> 2], v[a >> 2], 0),
                d = v[a + 32 >> 2],
                e = c.getTimezoneOffset(),
                g = new Date(c.getFullYear(), 0, 1),
                h = (new Date(c.getFullYear(), 6, 1)).getTimezoneOffset(),
                k = g.getTimezoneOffset(),
                m = Math.min(k, h);
                0 > d ? v[a + 32 >> 2] = Number(h != k && m == e) : 0 < d != (m == e) && (h = Math.max(k, h), c.setTime(c.getTime() + 6E4 * ((0 < d ? m : h) - e)));
                v[a + 24 >> 2] = c.getDay();
                v[a +
                    28 >> 2] = (c.getTime() - g.getTime()) / 864E5 | 0;
                v[a >> 2] = c.getSeconds();
                v[a + 4 >> 2] = c.getMinutes();
                v[a + 8 >> 2] = c.getHours();
                v[a + 12 >> 2] = c.getDate();
                v[a + 16 >> 2] = c.getMonth();
                return c.getTime() / 1E3 | 0
            },
            F: function (a, c, d, e, g, h) {
                try {
                    var k = D.gg(e);
                    if (!k)
                        return -8;
                    var m = D.lg(k, a, g, c, d),
                    t = m.If;
                    v[h >> 2] = m.kh;
                    return t
                } catch (u) {
                    if ("undefined" == typeof D || !(u instanceof D.Jf))
                        throw u;
                    return -u.Rf
                }
            },
            G: function (a, c, d, e, g, h) {
                try {
                    var k = D.gg(g);
                    if (k && d & 2) {
                        var m = ya.slice(a, a + c);
                        D.sg(k, m, h, c, e)
                    }
                } catch (t) {
                    if ("undefined" == typeof D || !(t instanceof
                            D.Jf))
                        throw t;
                    return -t.Rf
                }
            },
            S: Bb,
            n: function () {
                n("")
            },
            t: function (a, c, d) {
                Cb.length = 0;
                var e;
                for (d >>= 2; e = ya[c++]; )
                    d += 105 != e & d, Cb.push(105 == e ? v[d] : Ea[d++ >> 1]), ++d;
                return Wa[a].apply(null, Cb)
            },
            N: Db,
            T: function (a, c, d) {
                ya.copyWithin(a, c, c + d)
            },
            C: function (a) {
                var c = ya.length;
                a >>>= 0;
                if (2147483648 < a)
                    return !1;
                for (var d = 1; 4 >= d; d *= 2) {
                    var e = c * (1 + .2 / d);
                    e = Math.min(e, a + 100663296);
                    var g = Math;
                    e = Math.max(a, e);
                    g = g.min.call(g, 2147483648, e + (65536 - e % 65536) % 65536);
                    a: {
                        try {
                            ta.grow(g - Ba.byteLength + 65535 >>> 16);
                            Fa();
                            var h = 1;
                            break a
                        } catch (k) {}
                        h =
                            void 0
                    }
                    if (h)
                        return !0
                }
                return !1
            },
            H: function (a, c) {
                var d = 0;
                Fb().forEach(function (e, g) {
                    var h = c + d;
                    g = y[a + 4 * g >> 2] = h;
                    for (h = 0; h < e.length; ++h)
                        r[g++ >> 0] = e.charCodeAt(h);
                    r[g >> 0] = 0;
                    d += e.length + 1
                });
                return 0
            },
            I: function (a, c) {
                var d = Fb();
                y[a >> 2] = d.length;
                var e = 0;
                d.forEach(function (g) {
                    e += g.length + 1
                });
                y[c >> 2] = e;
                return 0
            },
            m: function (a) {
                if (!noExitRuntime) {
                    if (b.onExit)
                        b.onExit(a);
                    ua = !0
                }
                ea(a, new oa(a))
            },
            s: function (a) {
                try {
                    var c = xb(a);
                    D.close(c);
                    return 0
                } catch (d) {
                    if ("undefined" == typeof D || !(d instanceof D.Jf))
                        throw d;
                    return d.Rf
                }
            },
            v: function (a, c, d, e) {
                try {
                    a: {
                        var g = xb(a);
                        a = c;
                        for (var h = c = 0; h < d; h++) {
                            var k = y[a >> 2],
                            m = y[a + 4 >> 2];
                            a += 8;
                            var t = D.read(g, r, k, m, void 0);
                            if (0 > t) {
                                var u = -1;
                                break a
                            }
                            c += t;
                            if (t < m)
                                break
                        }
                        u = c
                    }
                    v[e >> 2] = u;
                    return 0
                } catch (p) {
                    if ("undefined" == typeof D || !(p instanceof D.Jf))
                        throw p;
                    return p.Rf
                }
            },
            z: function (a, c, d, e, g) {
                try {
                    c = d + 2097152 >>> 0 < 4194305 - !!c ? (c >>> 0) + 4294967296 * d : NaN;
                    if (isNaN(c))
                        return 61;
                    var h = xb(a);
                    D.Zf(h, c, e);
                    C = [h.position >>> 0, (A = h.position, 1 <= +Math.abs(A) ? 0 < A ? (Math.min(+Math.floor(A / 4294967296), 4294967295) | 0) >>> 0 :
                            ~~+Math.ceil((A -  + (~~A >>> 0)) / 4294967296) >>> 0 : 0)];
                    v[g >> 2] = C[0];
                    v[g + 4 >> 2] = C[1];
                    h.Vg && 0 === c && 0 === e && (h.Vg = null);
                    return 0
                } catch (k) {
                    if ("undefined" == typeof D || !(k instanceof D.Jf))
                        throw k;
                    return k.Rf
                }
            },
            r: function (a, c, d, e) {
                try {
                    a: {
                        var g = xb(a);
                        a = c;
                        for (var h = c = 0; h < d; h++) {
                            var k = y[a >> 2],
                            m = y[a + 4 >> 2];
                            a += 8;
                            var t = D.write(g, r, k, m, void 0);
                            if (0 > t) {
                                var u = -1;
                                break a
                            }
                            c += t
                        }
                        u = c
                    }
                    y[e >> 2] = u;
                    return 0
                } catch (p) {
                    if ("undefined" == typeof D || !(p instanceof D.Jf))
                        throw p;
                    return p.Rf
                }
            },
            a: function () {
                return ra
            },
            e: Pb,
            h: Qb,
            d: Rb,
            j: Sb,
            k: Tb,
            g: Ub,
            f: Vb,
            i: Wb,
            l: Xb,
            x: Yb,
            y: Zb,
            b: function (a) {
                ra = a
            },
            W: Kb,
            A: function (a, c, d, e) {
                return Kb(a, c, d, e)
            }
        };
        (function () {
            function a(g) {
                b.asm = g.exports;
                ta = b.asm.X;
                Fa();
                Ga = b.asm.tf;
                Ia.unshift(b.asm.Y);
                Ra("wasm-instantiate")
            }
            function c(g) {
                a(g.instance)
            }
            function d(g) {
                return Va().then(function (h) {
                    return WebAssembly.instantiate(h, e)
                }).then(function (h) {
                    return h
                }).then(g, function (h) {
                    pa("failed to asynchronously prepare wasm: " + h);
                    n(h)
                })
            }
            var e = {
                a: $b
            };
            Qa("wasm-instantiate");
            if (b.instantiateWasm)
                try {
                    return b.instantiateWasm(e, a)
                } catch (g) {
                    return pa("Module.instantiateWasm callback failed with error: " + g),
                    !1
                }
            (function () {
                return sa ||
                "function" != typeof WebAssembly.instantiateStreaming || Sa() || z.startsWith("file://") || ia || "function" != typeof fetch ? d(c) : fetch(z, {
                    credentials: "same-origin"
                }).then(function (g) {
                    return WebAssembly.instantiateStreaming(g, e).then(c, function (h) {
                        pa("wasm streaming compile failed: " + h);
                        pa("falling back to ArrayBuffer instantiation");
                        return d(c)
                    })
                })
            })().catch(ba);
            return {}
        })();
        b.___wasm_call_ctors = function () {
            return (b.___wasm_call_ctors = b.asm.Y).apply(null, arguments)
        };
        var ac = b._emscripten_bind_ParagraphJustification___destroy___0 = function () {
            return (ac = b._emscripten_bind_ParagraphJustification___destroy___0 = b.asm.Z).apply(null, arguments)
        },
        bc = b._emscripten_bind_BoolPtr___destroy___0 = function () {
            return (bc = b._emscripten_bind_BoolPtr___destroy___0 = b.asm._).apply(null, arguments)
        },
        cc = b._emscripten_bind_TessResultRenderer_BeginDocument_1 = function () {
            return (cc = b._emscripten_bind_TessResultRenderer_BeginDocument_1 = b.asm.$).apply(null, arguments)
        },
        dc = b._emscripten_bind_TessResultRenderer_AddImage_1 =
        function () {
            return (dc = b._emscripten_bind_TessResultRenderer_AddImage_1 = b.asm.aa).apply(null, arguments)
        },
        ec = b._emscripten_bind_TessResultRenderer_EndDocument_0 = function () {
            return (ec = b._emscripten_bind_TessResultRenderer_EndDocument_0 = b.asm.ba).apply(null, arguments)
        },
        fc = b._emscripten_bind_TessResultRenderer_happy_0 = function () {
            return (fc = b._emscripten_bind_TessResultRenderer_happy_0 = b.asm.ca).apply(null, arguments)
        },
        gc = b._emscripten_bind_TessResultRenderer_file_extension_0 = function () {
            return (gc = b._emscripten_bind_TessResultRenderer_file_extension_0 =
                    b.asm.da).apply(null, arguments)
        },
        hc = b._emscripten_bind_TessResultRenderer_title_0 = function () {
            return (hc = b._emscripten_bind_TessResultRenderer_title_0 = b.asm.ea).apply(null, arguments)
        },
        ic = b._emscripten_bind_TessResultRenderer_imagenum_0 = function () {
            return (ic = b._emscripten_bind_TessResultRenderer_imagenum_0 = b.asm.fa).apply(null, arguments)
        },
        jc = b._emscripten_bind_TessResultRenderer___destroy___0 = function () {
            return (jc = b._emscripten_bind_TessResultRenderer___destroy___0 = b.asm.ga).apply(null, arguments)
        },
        kc =
            b._emscripten_bind_LongStarPtr___destroy___0 = function () {
            return (kc = b._emscripten_bind_LongStarPtr___destroy___0 = b.asm.ha).apply(null, arguments)
        },
        lc = b._emscripten_bind_VoidPtr___destroy___0 = function () {
            return (lc = b._emscripten_bind_VoidPtr___destroy___0 = b.asm.ia).apply(null, arguments)
        },
        mc = b._emscripten_bind_ResultIterator_ResultIterator_1 = function () {
            return (mc = b._emscripten_bind_ResultIterator_ResultIterator_1 = b.asm.ja).apply(null, arguments)
        },
        nc = b._emscripten_bind_ResultIterator_Begin_0 = function () {
            return (nc =
                    b._emscripten_bind_ResultIterator_Begin_0 = b.asm.ka).apply(null, arguments)
        },
        oc = b._emscripten_bind_ResultIterator_RestartParagraph_0 = function () {
            return (oc = b._emscripten_bind_ResultIterator_RestartParagraph_0 = b.asm.la).apply(null, arguments)
        },
        pc = b._emscripten_bind_ResultIterator_IsWithinFirstTextlineOfParagraph_0 = function () {
            return (pc = b._emscripten_bind_ResultIterator_IsWithinFirstTextlineOfParagraph_0 = b.asm.ma).apply(null, arguments)
        },
        qc = b._emscripten_bind_ResultIterator_RestartRow_0 = function () {
            return (qc =
                    b._emscripten_bind_ResultIterator_RestartRow_0 = b.asm.na).apply(null, arguments)
        },
        rc = b._emscripten_bind_ResultIterator_Next_1 = function () {
            return (rc = b._emscripten_bind_ResultIterator_Next_1 = b.asm.oa).apply(null, arguments)
        },
        sc = b._emscripten_bind_ResultIterator_IsAtBeginningOf_1 = function () {
            return (sc = b._emscripten_bind_ResultIterator_IsAtBeginningOf_1 = b.asm.pa).apply(null, arguments)
        },
        tc = b._emscripten_bind_ResultIterator_IsAtFinalElement_2 = function () {
            return (tc = b._emscripten_bind_ResultIterator_IsAtFinalElement_2 =
                    b.asm.qa).apply(null, arguments)
        },
        uc = b._emscripten_bind_ResultIterator_Cmp_1 = function () {
            return (uc = b._emscripten_bind_ResultIterator_Cmp_1 = b.asm.ra).apply(null, arguments)
        },
        vc = b._emscripten_bind_ResultIterator_SetBoundingBoxComponents_2 = function () {
            return (vc = b._emscripten_bind_ResultIterator_SetBoundingBoxComponents_2 = b.asm.sa).apply(null, arguments)
        },
        wc = b._emscripten_bind_ResultIterator_BoundingBox_5 = function () {
            return (wc = b._emscripten_bind_ResultIterator_BoundingBox_5 = b.asm.ta).apply(null, arguments)
        },
        xc = b._emscripten_bind_ResultIterator_BoundingBox_6 = function () {
            return (xc = b._emscripten_bind_ResultIterator_BoundingBox_6 = b.asm.ua).apply(null, arguments)
        },
        yc = b._emscripten_bind_ResultIterator_BoundingBoxInternal_5 = function () {
            return (yc = b._emscripten_bind_ResultIterator_BoundingBoxInternal_5 = b.asm.va).apply(null, arguments)
        },
        zc = b._emscripten_bind_ResultIterator_Empty_1 = function () {
            return (zc = b._emscripten_bind_ResultIterator_Empty_1 = b.asm.wa).apply(null, arguments)
        },
        Ac = b._emscripten_bind_ResultIterator_BlockType_0 =
        function () {
            return (Ac = b._emscripten_bind_ResultIterator_BlockType_0 = b.asm.xa).apply(null, arguments)
        },
        Bc = b._emscripten_bind_ResultIterator_BlockPolygon_0 = function () {
            return (Bc = b._emscripten_bind_ResultIterator_BlockPolygon_0 = b.asm.ya).apply(null, arguments)
        },
        Cc = b._emscripten_bind_ResultIterator_GetBinaryImage_1 = function () {
            return (Cc = b._emscripten_bind_ResultIterator_GetBinaryImage_1 = b.asm.za).apply(null, arguments)
        },
        Dc = b._emscripten_bind_ResultIterator_GetImage_5 = function () {
            return (Dc = b._emscripten_bind_ResultIterator_GetImage_5 =
                    b.asm.Aa).apply(null, arguments)
        },
        Ec = b._emscripten_bind_ResultIterator_Baseline_5 = function () {
            return (Ec = b._emscripten_bind_ResultIterator_Baseline_5 = b.asm.Ba).apply(null, arguments)
        },
        Fc = b._emscripten_bind_ResultIterator_Orientation_4 = function () {
            return (Fc = b._emscripten_bind_ResultIterator_Orientation_4 = b.asm.Ca).apply(null, arguments)
        },
        Gc = b._emscripten_bind_ResultIterator_ParagraphInfo_4 = function () {
            return (Gc = b._emscripten_bind_ResultIterator_ParagraphInfo_4 = b.asm.Da).apply(null, arguments)
        },
        Hc = b._emscripten_bind_ResultIterator_ParagraphIsLtr_0 =
        function () {
            return (Hc = b._emscripten_bind_ResultIterator_ParagraphIsLtr_0 = b.asm.Ea).apply(null, arguments)
        },
        Ic = b._emscripten_bind_ResultIterator_GetUTF8Text_1 = function () {
            return (Ic = b._emscripten_bind_ResultIterator_GetUTF8Text_1 = b.asm.Fa).apply(null, arguments)
        },
        Jc = b._emscripten_bind_ResultIterator_SetLineSeparator_1 = function () {
            return (Jc = b._emscripten_bind_ResultIterator_SetLineSeparator_1 = b.asm.Ga).apply(null, arguments)
        },
        Kc = b._emscripten_bind_ResultIterator_SetParagraphSeparator_1 = function () {
            return (Kc =
                    b._emscripten_bind_ResultIterator_SetParagraphSeparator_1 = b.asm.Ha).apply(null, arguments)
        },
        Lc = b._emscripten_bind_ResultIterator_Confidence_1 = function () {
            return (Lc = b._emscripten_bind_ResultIterator_Confidence_1 = b.asm.Ia).apply(null, arguments)
        },
        Mc = b._emscripten_bind_ResultIterator_WordFontAttributes_8 = function () {
            return (Mc = b._emscripten_bind_ResultIterator_WordFontAttributes_8 = b.asm.Ja).apply(null, arguments)
        },
        Nc = b._emscripten_bind_ResultIterator_WordRecognitionLanguage_0 = function () {
            return (Nc = b._emscripten_bind_ResultIterator_WordRecognitionLanguage_0 =
                    b.asm.Ka).apply(null, arguments)
        },
        Oc = b._emscripten_bind_ResultIterator_WordDirection_0 = function () {
            return (Oc = b._emscripten_bind_ResultIterator_WordDirection_0 = b.asm.La).apply(null, arguments)
        },
        Pc = b._emscripten_bind_ResultIterator_WordIsFromDictionary_0 = function () {
            return (Pc = b._emscripten_bind_ResultIterator_WordIsFromDictionary_0 = b.asm.Ma).apply(null, arguments)
        },
        Qc = b._emscripten_bind_ResultIterator_WordIsNumeric_0 = function () {
            return (Qc = b._emscripten_bind_ResultIterator_WordIsNumeric_0 = b.asm.Na).apply(null,
                arguments)
        },
        Rc = b._emscripten_bind_ResultIterator_HasBlamerInfo_0 = function () {
            return (Rc = b._emscripten_bind_ResultIterator_HasBlamerInfo_0 = b.asm.Oa).apply(null, arguments)
        },
        Sc = b._emscripten_bind_ResultIterator_HasTruthString_0 = function () {
            return (Sc = b._emscripten_bind_ResultIterator_HasTruthString_0 = b.asm.Pa).apply(null, arguments)
        },
        Tc = b._emscripten_bind_ResultIterator_EquivalentToTruth_1 = function () {
            return (Tc = b._emscripten_bind_ResultIterator_EquivalentToTruth_1 = b.asm.Qa).apply(null, arguments)
        },
        Uc = b._emscripten_bind_ResultIterator_WordTruthUTF8Text_0 =
        function () {
            return (Uc = b._emscripten_bind_ResultIterator_WordTruthUTF8Text_0 = b.asm.Ra).apply(null, arguments)
        },
        Vc = b._emscripten_bind_ResultIterator_WordNormedUTF8Text_0 = function () {
            return (Vc = b._emscripten_bind_ResultIterator_WordNormedUTF8Text_0 = b.asm.Sa).apply(null, arguments)
        },
        Wc = b._emscripten_bind_ResultIterator_WordLattice_1 = function () {
            return (Wc = b._emscripten_bind_ResultIterator_WordLattice_1 = b.asm.Ta).apply(null, arguments)
        },
        Xc = b._emscripten_bind_ResultIterator_SymbolIsSuperscript_0 = function () {
            return (Xc =
                    b._emscripten_bind_ResultIterator_SymbolIsSuperscript_0 = b.asm.Ua).apply(null, arguments)
        },
        Yc = b._emscripten_bind_ResultIterator_SymbolIsSubscript_0 = function () {
            return (Yc = b._emscripten_bind_ResultIterator_SymbolIsSubscript_0 = b.asm.Va).apply(null, arguments)
        },
        Zc = b._emscripten_bind_ResultIterator_SymbolIsDropcap_0 = function () {
            return (Zc = b._emscripten_bind_ResultIterator_SymbolIsDropcap_0 = b.asm.Wa).apply(null, arguments)
        },
        $c = b._emscripten_bind_ResultIterator___destroy___0 = function () {
            return ($c = b._emscripten_bind_ResultIterator___destroy___0 =
                    b.asm.Xa).apply(null, arguments)
        },
        ad = b._emscripten_bind_TextlineOrder___destroy___0 = function () {
            return (ad = b._emscripten_bind_TextlineOrder___destroy___0 = b.asm.Ya).apply(null, arguments)
        },
        bd = b._emscripten_bind_ETEXT_DESC___destroy___0 = function () {
            return (bd = b._emscripten_bind_ETEXT_DESC___destroy___0 = b.asm.Za).apply(null, arguments)
        },
        cd = b._emscripten_bind_PageIterator_Begin_0 = function () {
            return (cd = b._emscripten_bind_PageIterator_Begin_0 = b.asm._a).apply(null, arguments)
        },
        dd = b._emscripten_bind_PageIterator_RestartParagraph_0 =
        function () {
            return (dd = b._emscripten_bind_PageIterator_RestartParagraph_0 = b.asm.$a).apply(null, arguments)
        },
        ed = b._emscripten_bind_PageIterator_IsWithinFirstTextlineOfParagraph_0 = function () {
            return (ed = b._emscripten_bind_PageIterator_IsWithinFirstTextlineOfParagraph_0 = b.asm.ab).apply(null, arguments)
        },
        fd = b._emscripten_bind_PageIterator_RestartRow_0 = function () {
            return (fd = b._emscripten_bind_PageIterator_RestartRow_0 = b.asm.bb).apply(null, arguments)
        },
        gd = b._emscripten_bind_PageIterator_Next_1 = function () {
            return (gd =
                    b._emscripten_bind_PageIterator_Next_1 = b.asm.cb).apply(null, arguments)
        },
        hd = b._emscripten_bind_PageIterator_IsAtBeginningOf_1 = function () {
            return (hd = b._emscripten_bind_PageIterator_IsAtBeginningOf_1 = b.asm.db).apply(null, arguments)
        },
        jd = b._emscripten_bind_PageIterator_IsAtFinalElement_2 = function () {
            return (jd = b._emscripten_bind_PageIterator_IsAtFinalElement_2 = b.asm.eb).apply(null, arguments)
        },
        kd = b._emscripten_bind_PageIterator_Cmp_1 = function () {
            return (kd = b._emscripten_bind_PageIterator_Cmp_1 = b.asm.fb).apply(null,
                arguments)
        },
        ld = b._emscripten_bind_PageIterator_SetBoundingBoxComponents_2 = function () {
            return (ld = b._emscripten_bind_PageIterator_SetBoundingBoxComponents_2 = b.asm.gb).apply(null, arguments)
        },
        md = b._emscripten_bind_PageIterator_BoundingBox_5 = function () {
            return (md = b._emscripten_bind_PageIterator_BoundingBox_5 = b.asm.hb).apply(null, arguments)
        },
        nd = b._emscripten_bind_PageIterator_BoundingBox_6 = function () {
            return (nd = b._emscripten_bind_PageIterator_BoundingBox_6 = b.asm.ib).apply(null, arguments)
        },
        od = b._emscripten_bind_PageIterator_BoundingBoxInternal_5 =
        function () {
            return (od = b._emscripten_bind_PageIterator_BoundingBoxInternal_5 = b.asm.jb).apply(null, arguments)
        },
        pd = b._emscripten_bind_PageIterator_Empty_1 = function () {
            return (pd = b._emscripten_bind_PageIterator_Empty_1 = b.asm.kb).apply(null, arguments)
        },
        qd = b._emscripten_bind_PageIterator_BlockType_0 = function () {
            return (qd = b._emscripten_bind_PageIterator_BlockType_0 = b.asm.lb).apply(null, arguments)
        },
        rd = b._emscripten_bind_PageIterator_BlockPolygon_0 = function () {
            return (rd = b._emscripten_bind_PageIterator_BlockPolygon_0 =
                    b.asm.mb).apply(null, arguments)
        },
        sd = b._emscripten_bind_PageIterator_GetBinaryImage_1 = function () {
            return (sd = b._emscripten_bind_PageIterator_GetBinaryImage_1 = b.asm.nb).apply(null, arguments)
        },
        td = b._emscripten_bind_PageIterator_GetImage_5 = function () {
            return (td = b._emscripten_bind_PageIterator_GetImage_5 = b.asm.ob).apply(null, arguments)
        },
        ud = b._emscripten_bind_PageIterator_Baseline_5 = function () {
            return (ud = b._emscripten_bind_PageIterator_Baseline_5 = b.asm.pb).apply(null, arguments)
        },
        vd = b._emscripten_bind_PageIterator_Orientation_4 =
        function () {
            return (vd = b._emscripten_bind_PageIterator_Orientation_4 = b.asm.qb).apply(null, arguments)
        },
        wd = b._emscripten_bind_PageIterator_ParagraphInfo_4 = function () {
            return (wd = b._emscripten_bind_PageIterator_ParagraphInfo_4 = b.asm.rb).apply(null, arguments)
        },
        xd = b._emscripten_bind_PageIterator___destroy___0 = function () {
            return (xd = b._emscripten_bind_PageIterator___destroy___0 = b.asm.sb).apply(null, arguments)
        },
        yd = b._emscripten_bind_WritingDirection___destroy___0 = function () {
            return (yd = b._emscripten_bind_WritingDirection___destroy___0 =
                    b.asm.tb).apply(null, arguments)
        },
        zd = b._emscripten_bind_WordChoiceIterator_WordChoiceIterator_1 = function () {
            return (zd = b._emscripten_bind_WordChoiceIterator_WordChoiceIterator_1 = b.asm.ub).apply(null, arguments)
        },
        Ad = b._emscripten_bind_WordChoiceIterator_Next_0 = function () {
            return (Ad = b._emscripten_bind_WordChoiceIterator_Next_0 = b.asm.vb).apply(null, arguments)
        },
        Bd = b._emscripten_bind_WordChoiceIterator_GetUTF8Text_0 = function () {
            return (Bd = b._emscripten_bind_WordChoiceIterator_GetUTF8Text_0 = b.asm.wb).apply(null,
                arguments)
        },
        Cd = b._emscripten_bind_WordChoiceIterator_Confidence_0 = function () {
            return (Cd = b._emscripten_bind_WordChoiceIterator_Confidence_0 = b.asm.xb).apply(null, arguments)
        },
        Dd = b._emscripten_bind_WordChoiceIterator___destroy___0 = function () {
            return (Dd = b._emscripten_bind_WordChoiceIterator___destroy___0 = b.asm.yb).apply(null, arguments)
        },
        Ed = b._emscripten_bind_Box_get_x_0 = function () {
            return (Ed = b._emscripten_bind_Box_get_x_0 = b.asm.zb).apply(null, arguments)
        },
        Fd = b._emscripten_bind_Box_get_y_0 = function () {
            return (Fd =
                    b._emscripten_bind_Box_get_y_0 = b.asm.Ab).apply(null, arguments)
        },
        Gd = b._emscripten_bind_Box_get_w_0 = function () {
            return (Gd = b._emscripten_bind_Box_get_w_0 = b.asm.Bb).apply(null, arguments)
        },
        Hd = b._emscripten_bind_Box_get_h_0 = function () {
            return (Hd = b._emscripten_bind_Box_get_h_0 = b.asm.Cb).apply(null, arguments)
        },
        Id = b._emscripten_bind_Box_get_refcount_0 = function () {
            return (Id = b._emscripten_bind_Box_get_refcount_0 = b.asm.Db).apply(null, arguments)
        },
        Jd = b._emscripten_bind_Box___destroy___0 = function () {
            return (Jd = b._emscripten_bind_Box___destroy___0 =
                    b.asm.Eb).apply(null, arguments)
        },
        Kd = b._emscripten_bind_TessPDFRenderer_TessPDFRenderer_3 = function () {
            return (Kd = b._emscripten_bind_TessPDFRenderer_TessPDFRenderer_3 = b.asm.Fb).apply(null, arguments)
        },
        Ld = b._emscripten_bind_TessPDFRenderer_BeginDocument_1 = function () {
            return (Ld = b._emscripten_bind_TessPDFRenderer_BeginDocument_1 = b.asm.Gb).apply(null, arguments)
        },
        Md = b._emscripten_bind_TessPDFRenderer_AddImage_1 = function () {
            return (Md = b._emscripten_bind_TessPDFRenderer_AddImage_1 = b.asm.Hb).apply(null, arguments)
        },
        Nd = b._emscripten_bind_TessPDFRenderer_EndDocument_0 = function () {
            return (Nd = b._emscripten_bind_TessPDFRenderer_EndDocument_0 = b.asm.Ib).apply(null, arguments)
        },
        Od = b._emscripten_bind_TessPDFRenderer_happy_0 = function () {
            return (Od = b._emscripten_bind_TessPDFRenderer_happy_0 = b.asm.Jb).apply(null, arguments)
        },
        Pd = b._emscripten_bind_TessPDFRenderer_file_extension_0 = function () {
            return (Pd = b._emscripten_bind_TessPDFRenderer_file_extension_0 = b.asm.Kb).apply(null, arguments)
        },
        Qd = b._emscripten_bind_TessPDFRenderer_title_0 =
        function () {
            return (Qd = b._emscripten_bind_TessPDFRenderer_title_0 = b.asm.Lb).apply(null, arguments)
        },
        Rd = b._emscripten_bind_TessPDFRenderer_imagenum_0 = function () {
            return (Rd = b._emscripten_bind_TessPDFRenderer_imagenum_0 = b.asm.Mb).apply(null, arguments)
        },
        Sd = b._emscripten_bind_TessPDFRenderer___destroy___0 = function () {
            return (Sd = b._emscripten_bind_TessPDFRenderer___destroy___0 = b.asm.Nb).apply(null, arguments)
        },
        Td = b._emscripten_bind_PixaPtr___destroy___0 = function () {
            return (Td = b._emscripten_bind_PixaPtr___destroy___0 =
                    b.asm.Ob).apply(null, arguments)
        },
        Ud = b._emscripten_bind_FloatPtr___destroy___0 = function () {
            return (Ud = b._emscripten_bind_FloatPtr___destroy___0 = b.asm.Pb).apply(null, arguments)
        },
        Vd = b._emscripten_bind_ChoiceIterator_ChoiceIterator_1 = function () {
            return (Vd = b._emscripten_bind_ChoiceIterator_ChoiceIterator_1 = b.asm.Qb).apply(null, arguments)
        },
        Wd = b._emscripten_bind_ChoiceIterator_Next_0 = function () {
            return (Wd = b._emscripten_bind_ChoiceIterator_Next_0 = b.asm.Rb).apply(null, arguments)
        },
        Xd = b._emscripten_bind_ChoiceIterator_GetUTF8Text_0 =
        function () {
            return (Xd = b._emscripten_bind_ChoiceIterator_GetUTF8Text_0 = b.asm.Sb).apply(null, arguments)
        },
        Yd = b._emscripten_bind_ChoiceIterator_Confidence_0 = function () {
            return (Yd = b._emscripten_bind_ChoiceIterator_Confidence_0 = b.asm.Tb).apply(null, arguments)
        },
        Zd = b._emscripten_bind_ChoiceIterator___destroy___0 = function () {
            return (Zd = b._emscripten_bind_ChoiceIterator___destroy___0 = b.asm.Ub).apply(null, arguments)
        },
        $d = b._emscripten_bind_PixPtr___destroy___0 = function () {
            return ($d = b._emscripten_bind_PixPtr___destroy___0 =
                    b.asm.Vb).apply(null, arguments)
        },
        ae = b._emscripten_bind_UNICHARSET_get_script_from_script_id_1 = function () {
            return (ae = b._emscripten_bind_UNICHARSET_get_script_from_script_id_1 = b.asm.Wb).apply(null, arguments)
        },
        be = b._emscripten_bind_UNICHARSET_get_script_id_from_name_1 = function () {
            return (be = b._emscripten_bind_UNICHARSET_get_script_id_from_name_1 = b.asm.Xb).apply(null, arguments)
        },
        ce = b._emscripten_bind_UNICHARSET_get_script_table_size_0 = function () {
            return (ce = b._emscripten_bind_UNICHARSET_get_script_table_size_0 =
                    b.asm.Yb).apply(null, arguments)
        },
        de = b._emscripten_bind_UNICHARSET___destroy___0 = function () {
            return (de = b._emscripten_bind_UNICHARSET___destroy___0 = b.asm.Zb).apply(null, arguments)
        },
        ee = b._emscripten_bind_IntPtr___destroy___0 = function () {
            return (ee = b._emscripten_bind_IntPtr___destroy___0 = b.asm._b).apply(null, arguments)
        },
        fe = b._emscripten_bind_Orientation___destroy___0 = function () {
            return (fe = b._emscripten_bind_Orientation___destroy___0 = b.asm.$b).apply(null, arguments)
        },
        ge = b._emscripten_bind_OSBestResult_get_orientation_id_0 =
        function () {
            return (ge = b._emscripten_bind_OSBestResult_get_orientation_id_0 = b.asm.ac).apply(null, arguments)
        },
        he = b._emscripten_bind_OSBestResult_get_script_id_0 = function () {
            return (he = b._emscripten_bind_OSBestResult_get_script_id_0 = b.asm.bc).apply(null, arguments)
        },
        ie = b._emscripten_bind_OSBestResult_get_sconfidence_0 = function () {
            return (ie = b._emscripten_bind_OSBestResult_get_sconfidence_0 = b.asm.cc).apply(null, arguments)
        },
        je = b._emscripten_bind_OSBestResult_get_oconfidence_0 = function () {
            return (je = b._emscripten_bind_OSBestResult_get_oconfidence_0 =
                    b.asm.dc).apply(null, arguments)
        },
        ke = b._emscripten_bind_OSBestResult___destroy___0 = function () {
            return (ke = b._emscripten_bind_OSBestResult___destroy___0 = b.asm.ec).apply(null, arguments)
        },
        le = b._emscripten_bind_Boxa_get_n_0 = function () {
            return (le = b._emscripten_bind_Boxa_get_n_0 = b.asm.fc).apply(null, arguments)
        },
        me = b._emscripten_bind_Boxa_get_nalloc_0 = function () {
            return (me = b._emscripten_bind_Boxa_get_nalloc_0 = b.asm.gc).apply(null, arguments)
        },
        ne = b._emscripten_bind_Boxa_get_refcount_0 = function () {
            return (ne = b._emscripten_bind_Boxa_get_refcount_0 =
                    b.asm.hc).apply(null, arguments)
        },
        oe = b._emscripten_bind_Boxa_get_box_0 = function () {
            return (oe = b._emscripten_bind_Boxa_get_box_0 = b.asm.ic).apply(null, arguments)
        },
        pe = b._emscripten_bind_Boxa___destroy___0 = function () {
            return (pe = b._emscripten_bind_Boxa___destroy___0 = b.asm.jc).apply(null, arguments)
        },
        qe = b._emscripten_bind_PixColormap_get_array_0 = function () {
            return (qe = b._emscripten_bind_PixColormap_get_array_0 = b.asm.kc).apply(null, arguments)
        },
        re = b._emscripten_bind_PixColormap_get_depth_0 = function () {
            return (re =
                    b._emscripten_bind_PixColormap_get_depth_0 = b.asm.lc).apply(null, arguments)
        },
        se = b._emscripten_bind_PixColormap_get_nalloc_0 = function () {
            return (se = b._emscripten_bind_PixColormap_get_nalloc_0 = b.asm.mc).apply(null, arguments)
        },
        te = b._emscripten_bind_PixColormap_get_n_0 = function () {
            return (te = b._emscripten_bind_PixColormap_get_n_0 = b.asm.nc).apply(null, arguments)
        },
        ue = b._emscripten_bind_PixColormap___destroy___0 = function () {
            return (ue = b._emscripten_bind_PixColormap___destroy___0 = b.asm.oc).apply(null, arguments)
        },
        ve = b._emscripten_bind_Pta_get_n_0 = function () {
            return (ve = b._emscripten_bind_Pta_get_n_0 = b.asm.pc).apply(null, arguments)
        },
        we = b._emscripten_bind_Pta_get_nalloc_0 = function () {
            return (we = b._emscripten_bind_Pta_get_nalloc_0 = b.asm.qc).apply(null, arguments)
        },
        xe = b._emscripten_bind_Pta_get_refcount_0 = function () {
            return (xe = b._emscripten_bind_Pta_get_refcount_0 = b.asm.rc).apply(null, arguments)
        },
        ye = b._emscripten_bind_Pta_get_x_0 = function () {
            return (ye = b._emscripten_bind_Pta_get_x_0 = b.asm.sc).apply(null, arguments)
        },
        ze =
            b._emscripten_bind_Pta_get_y_0 = function () {
            return (ze = b._emscripten_bind_Pta_get_y_0 = b.asm.tc).apply(null, arguments)
        },
        Ae = b._emscripten_bind_Pta___destroy___0 = function () {
            return (Ae = b._emscripten_bind_Pta___destroy___0 = b.asm.uc).apply(null, arguments)
        },
        Be = b._emscripten_bind_Pix_get_w_0 = function () {
            return (Be = b._emscripten_bind_Pix_get_w_0 = b.asm.vc).apply(null, arguments)
        },
        Ce = b._emscripten_bind_Pix_get_h_0 = function () {
            return (Ce = b._emscripten_bind_Pix_get_h_0 = b.asm.wc).apply(null, arguments)
        },
        De = b._emscripten_bind_Pix_get_d_0 =
        function () {
            return (De = b._emscripten_bind_Pix_get_d_0 = b.asm.xc).apply(null, arguments)
        },
        Ee = b._emscripten_bind_Pix_get_spp_0 = function () {
            return (Ee = b._emscripten_bind_Pix_get_spp_0 = b.asm.yc).apply(null, arguments)
        },
        Fe = b._emscripten_bind_Pix_get_wpl_0 = function () {
            return (Fe = b._emscripten_bind_Pix_get_wpl_0 = b.asm.zc).apply(null, arguments)
        },
        Ge = b._emscripten_bind_Pix_get_refcount_0 = function () {
            return (Ge = b._emscripten_bind_Pix_get_refcount_0 = b.asm.Ac).apply(null, arguments)
        },
        He = b._emscripten_bind_Pix_get_xres_0 =
        function () {
            return (He = b._emscripten_bind_Pix_get_xres_0 = b.asm.Bc).apply(null, arguments)
        },
        Ie = b._emscripten_bind_Pix_get_yres_0 = function () {
            return (Ie = b._emscripten_bind_Pix_get_yres_0 = b.asm.Cc).apply(null, arguments)
        },
        Je = b._emscripten_bind_Pix_get_informat_0 = function () {
            return (Je = b._emscripten_bind_Pix_get_informat_0 = b.asm.Dc).apply(null, arguments)
        },
        Ke = b._emscripten_bind_Pix_get_special_0 = function () {
            return (Ke = b._emscripten_bind_Pix_get_special_0 = b.asm.Ec).apply(null, arguments)
        },
        Le = b._emscripten_bind_Pix_get_text_0 =
        function () {
            return (Le = b._emscripten_bind_Pix_get_text_0 = b.asm.Fc).apply(null, arguments)
        },
        Me = b._emscripten_bind_Pix_get_colormap_0 = function () {
            return (Me = b._emscripten_bind_Pix_get_colormap_0 = b.asm.Gc).apply(null, arguments)
        },
        Ne = b._emscripten_bind_Pix_get_data_0 = function () {
            return (Ne = b._emscripten_bind_Pix_get_data_0 = b.asm.Hc).apply(null, arguments)
        },
        Oe = b._emscripten_bind_Pix___destroy___0 = function () {
            return (Oe = b._emscripten_bind_Pix___destroy___0 = b.asm.Ic).apply(null, arguments)
        },
        Pe = b._emscripten_bind_DoublePtr___destroy___0 =
        function () {
            return (Pe = b._emscripten_bind_DoublePtr___destroy___0 = b.asm.Jc).apply(null, arguments)
        },
        Qe = b._emscripten_bind_Dawg___destroy___0 = function () {
            return (Qe = b._emscripten_bind_Dawg___destroy___0 = b.asm.Kc).apply(null, arguments)
        },
        Re = b._emscripten_bind_BoxPtr___destroy___0 = function () {
            return (Re = b._emscripten_bind_BoxPtr___destroy___0 = b.asm.Lc).apply(null, arguments)
        },
        Se = b._emscripten_bind_TessBaseAPI_TessBaseAPI_0 = function () {
            return (Se = b._emscripten_bind_TessBaseAPI_TessBaseAPI_0 = b.asm.Mc).apply(null,
                arguments)
        },
        Te = b._emscripten_bind_TessBaseAPI_Version_0 = function () {
            return (Te = b._emscripten_bind_TessBaseAPI_Version_0 = b.asm.Nc).apply(null, arguments)
        },
        Ue = b._emscripten_bind_TessBaseAPI_SetInputName_1 = function () {
            return (Ue = b._emscripten_bind_TessBaseAPI_SetInputName_1 = b.asm.Oc).apply(null, arguments)
        },
        Ve = b._emscripten_bind_TessBaseAPI_GetInputName_0 = function () {
            return (Ve = b._emscripten_bind_TessBaseAPI_GetInputName_0 = b.asm.Pc).apply(null, arguments)
        },
        We = b._emscripten_bind_TessBaseAPI_SetInputImage_1 = function () {
            return (We =
                    b._emscripten_bind_TessBaseAPI_SetInputImage_1 = b.asm.Qc).apply(null, arguments)
        },
        Xe = b._emscripten_bind_TessBaseAPI_GetInputImage_0 = function () {
            return (Xe = b._emscripten_bind_TessBaseAPI_GetInputImage_0 = b.asm.Rc).apply(null, arguments)
        },
        Ye = b._emscripten_bind_TessBaseAPI_GetSourceYResolution_0 = function () {
            return (Ye = b._emscripten_bind_TessBaseAPI_GetSourceYResolution_0 = b.asm.Sc).apply(null, arguments)
        },
        Ze = b._emscripten_bind_TessBaseAPI_GetDatapath_0 = function () {
            return (Ze = b._emscripten_bind_TessBaseAPI_GetDatapath_0 =
                    b.asm.Tc).apply(null, arguments)
        },
        $e = b._emscripten_bind_TessBaseAPI_SetOutputName_1 = function () {
            return ($e = b._emscripten_bind_TessBaseAPI_SetOutputName_1 = b.asm.Uc).apply(null, arguments)
        },
        af = b._emscripten_bind_TessBaseAPI_SetVariable_2 = function () {
            return (af = b._emscripten_bind_TessBaseAPI_SetVariable_2 = b.asm.Vc).apply(null, arguments)
        },
        bf = b._emscripten_bind_TessBaseAPI_SetDebugVariable_2 = function () {
            return (bf = b._emscripten_bind_TessBaseAPI_SetDebugVariable_2 = b.asm.Wc).apply(null, arguments)
        },
        cf = b._emscripten_bind_TessBaseAPI_GetIntVariable_2 =
        function () {
            return (cf = b._emscripten_bind_TessBaseAPI_GetIntVariable_2 = b.asm.Xc).apply(null, arguments)
        },
        df = b._emscripten_bind_TessBaseAPI_GetBoolVariable_2 = function () {
            return (df = b._emscripten_bind_TessBaseAPI_GetBoolVariable_2 = b.asm.Yc).apply(null, arguments)
        },
        ef = b._emscripten_bind_TessBaseAPI_GetDoubleVariable_2 = function () {
            return (ef = b._emscripten_bind_TessBaseAPI_GetDoubleVariable_2 = b.asm.Zc).apply(null, arguments)
        },
        ff = b._emscripten_bind_TessBaseAPI_GetStringVariable_1 = function () {
            return (ff = b._emscripten_bind_TessBaseAPI_GetStringVariable_1 =
                    b.asm._c).apply(null, arguments)
        },
        gf = b._emscripten_bind_TessBaseAPI_SaveParameters_1 = function () {
            return (gf = b._emscripten_bind_TessBaseAPI_SaveParameters_1 = b.asm.$c).apply(null, arguments)
        },
        hf = b._emscripten_bind_TessBaseAPI_RestoreParameters_1 = function () {
            return (hf = b._emscripten_bind_TessBaseAPI_RestoreParameters_1 = b.asm.ad).apply(null, arguments)
        },
        jf = b._emscripten_bind_TessBaseAPI_Init_2 = function () {
            return (jf = b._emscripten_bind_TessBaseAPI_Init_2 = b.asm.bd).apply(null, arguments)
        },
        kf = b._emscripten_bind_TessBaseAPI_Init_3 =
        function () {
            return (kf = b._emscripten_bind_TessBaseAPI_Init_3 = b.asm.cd).apply(null, arguments)
        },
        lf = b._emscripten_bind_TessBaseAPI_Init_4 = function () {
            return (lf = b._emscripten_bind_TessBaseAPI_Init_4 = b.asm.dd).apply(null, arguments)
        },
        mf = b._emscripten_bind_TessBaseAPI_GetInitLanguagesAsString_0 = function () {
            return (mf = b._emscripten_bind_TessBaseAPI_GetInitLanguagesAsString_0 = b.asm.ed).apply(null, arguments)
        },
        nf = b._emscripten_bind_TessBaseAPI_InitForAnalysePage_0 = function () {
            return (nf = b._emscripten_bind_TessBaseAPI_InitForAnalysePage_0 =
                    b.asm.fd).apply(null, arguments)
        },
        of = b._emscripten_bind_TessBaseAPI_ReadConfigFile_1 = function () {
            return (of = b._emscripten_bind_TessBaseAPI_ReadConfigFile_1 = b.asm.gd).apply(null, arguments)
        },
        pf = b._emscripten_bind_TessBaseAPI_ReadDebugConfigFile_1 = function () {
            return (pf = b._emscripten_bind_TessBaseAPI_ReadDebugConfigFile_1 = b.asm.hd).apply(null, arguments)
        },
        qf = b._emscripten_bind_TessBaseAPI_SetPageSegMode_1 = function () {
            return (qf = b._emscripten_bind_TessBaseAPI_SetPageSegMode_1 = b.asm.id).apply(null, arguments)
        },
        rf = b._emscripten_bind_TessBaseAPI_GetPageSegMode_0 = function () {
            return (rf = b._emscripten_bind_TessBaseAPI_GetPageSegMode_0 = b.asm.jd).apply(null, arguments)
        },
        sf = b._emscripten_bind_TessBaseAPI_TesseractRect_7 = function () {
            return (sf = b._emscripten_bind_TessBaseAPI_TesseractRect_7 = b.asm.kd).apply(null, arguments)
        },
        tf = b._emscripten_bind_TessBaseAPI_ClearAdaptiveClassifier_0 = function () {
            return (tf = b._emscripten_bind_TessBaseAPI_ClearAdaptiveClassifier_0 = b.asm.ld).apply(null, arguments)
        },
        uf = b._emscripten_bind_TessBaseAPI_SetImage_1 =
        function () {
            return (uf = b._emscripten_bind_TessBaseAPI_SetImage_1 = b.asm.md).apply(null, arguments)
        },
        vf = b._emscripten_bind_TessBaseAPI_SetImage_5 = function () {
            return (vf = b._emscripten_bind_TessBaseAPI_SetImage_5 = b.asm.nd).apply(null, arguments)
        },
        wf = b._emscripten_bind_TessBaseAPI_SetImageFile_1 = function () {
            return (wf = b._emscripten_bind_TessBaseAPI_SetImageFile_1 = b.asm.od).apply(null, arguments)
        },
        xf = b._emscripten_bind_TessBaseAPI_SetSourceResolution_1 = function () {
            return (xf = b._emscripten_bind_TessBaseAPI_SetSourceResolution_1 =
                    b.asm.pd).apply(null, arguments)
        },
        yf = b._emscripten_bind_TessBaseAPI_SetRectangle_4 = function () {
            return (yf = b._emscripten_bind_TessBaseAPI_SetRectangle_4 = b.asm.qd).apply(null, arguments)
        },
        zf = b._emscripten_bind_TessBaseAPI_GetThresholdedImage_0 = function () {
            return (zf = b._emscripten_bind_TessBaseAPI_GetThresholdedImage_0 = b.asm.rd).apply(null, arguments)
        },
        Af = b._emscripten_bind_TessBaseAPI_WriteImage_0 = function () {
            return (Af = b._emscripten_bind_TessBaseAPI_WriteImage_0 = b.asm.sd).apply(null, arguments)
        },
        Bf = b._emscripten_bind_TessBaseAPI_FindLines_0 =
        function () {
            return (Bf = b._emscripten_bind_TessBaseAPI_FindLines_0 = b.asm.td).apply(null, arguments)
        },
        Cf = b._emscripten_bind_TessBaseAPI_GetGradient_0 = function () {
            return (Cf = b._emscripten_bind_TessBaseAPI_GetGradient_0 = b.asm.ud).apply(null, arguments)
        },
        Df = b._emscripten_bind_TessBaseAPI_GetRegions_1 = function () {
            return (Df = b._emscripten_bind_TessBaseAPI_GetRegions_1 = b.asm.vd).apply(null, arguments)
        },
        Ef = b._emscripten_bind_TessBaseAPI_GetTextlines_2 = function () {
            return (Ef = b._emscripten_bind_TessBaseAPI_GetTextlines_2 =
                    b.asm.wd).apply(null, arguments)
        },
        Ff = b._emscripten_bind_TessBaseAPI_GetTextlines_5 = function () {
            return (Ff = b._emscripten_bind_TessBaseAPI_GetTextlines_5 = b.asm.xd).apply(null, arguments)
        },
        Gf = b._emscripten_bind_TessBaseAPI_GetStrips_2 = function () {
            return (Gf = b._emscripten_bind_TessBaseAPI_GetStrips_2 = b.asm.yd).apply(null, arguments)
        },
        Hf = b._emscripten_bind_TessBaseAPI_GetWords_1 = function () {
            return (Hf = b._emscripten_bind_TessBaseAPI_GetWords_1 = b.asm.zd).apply(null, arguments)
        },
        If = b._emscripten_bind_TessBaseAPI_GetConnectedComponents_1 =
        function () {
            return (If = b._emscripten_bind_TessBaseAPI_GetConnectedComponents_1 = b.asm.Ad).apply(null, arguments)
        },
        Jf = b._emscripten_bind_TessBaseAPI_GetComponentImages_4 = function () {
            return (Jf = b._emscripten_bind_TessBaseAPI_GetComponentImages_4 = b.asm.Bd).apply(null, arguments)
        },
        Kf = b._emscripten_bind_TessBaseAPI_GetComponentImages_7 = function () {
            return (Kf = b._emscripten_bind_TessBaseAPI_GetComponentImages_7 = b.asm.Cd).apply(null, arguments)
        },
        Lf = b._emscripten_bind_TessBaseAPI_GetThresholdedImageScaleFactor_0 = function () {
            return (Lf =
                    b._emscripten_bind_TessBaseAPI_GetThresholdedImageScaleFactor_0 = b.asm.Dd).apply(null, arguments)
        },
        Mf = b._emscripten_bind_TessBaseAPI_AnalyseLayout_0 = function () {
            return (Mf = b._emscripten_bind_TessBaseAPI_AnalyseLayout_0 = b.asm.Ed).apply(null, arguments)
        },
        Nf = b._emscripten_bind_TessBaseAPI_AnalyseLayout_1 = function () {
            return (Nf = b._emscripten_bind_TessBaseAPI_AnalyseLayout_1 = b.asm.Fd).apply(null, arguments)
        },
        Of = b._emscripten_bind_TessBaseAPI_Recognize_1 = function () {
            return (Of = b._emscripten_bind_TessBaseAPI_Recognize_1 =
                    b.asm.Gd).apply(null, arguments)
        },
        Pf = b._emscripten_bind_TessBaseAPI_ProcessPages_4 = function () {
            return (Pf = b._emscripten_bind_TessBaseAPI_ProcessPages_4 = b.asm.Hd).apply(null, arguments)
        },
        Qf = b._emscripten_bind_TessBaseAPI_ProcessPage_6 = function () {
            return (Qf = b._emscripten_bind_TessBaseAPI_ProcessPage_6 = b.asm.Id).apply(null, arguments)
        },
        Rf = b._emscripten_bind_TessBaseAPI_GetIterator_0 = function () {
            return (Rf = b._emscripten_bind_TessBaseAPI_GetIterator_0 = b.asm.Jd).apply(null, arguments)
        },
        Sf = b._emscripten_bind_TessBaseAPI_GetUTF8Text_0 =
        function () {
            return (Sf = b._emscripten_bind_TessBaseAPI_GetUTF8Text_0 = b.asm.Kd).apply(null, arguments)
        },
        Tf = b._emscripten_bind_TessBaseAPI_GetHOCRText_1 = function () {
            return (Tf = b._emscripten_bind_TessBaseAPI_GetHOCRText_1 = b.asm.Ld).apply(null, arguments)
        },
        Uf = b._emscripten_bind_TessBaseAPI_GetTSVText_1 = function () {
            return (Uf = b._emscripten_bind_TessBaseAPI_GetTSVText_1 = b.asm.Md).apply(null, arguments)
        },
        Vf = b._emscripten_bind_TessBaseAPI_GetBoxText_1 = function () {
            return (Vf = b._emscripten_bind_TessBaseAPI_GetBoxText_1 =
                    b.asm.Nd).apply(null, arguments)
        },
        Wf = b._emscripten_bind_TessBaseAPI_GetUNLVText_0 = function () {
            return (Wf = b._emscripten_bind_TessBaseAPI_GetUNLVText_0 = b.asm.Od).apply(null, arguments)
        },
        Xf = b._emscripten_bind_TessBaseAPI_GetOsdText_1 = function () {
            return (Xf = b._emscripten_bind_TessBaseAPI_GetOsdText_1 = b.asm.Pd).apply(null, arguments)
        },
        Yf = b._emscripten_bind_TessBaseAPI_MeanTextConf_0 = function () {
            return (Yf = b._emscripten_bind_TessBaseAPI_MeanTextConf_0 = b.asm.Qd).apply(null, arguments)
        },
        Zf = b._emscripten_bind_TessBaseAPI_AllWordConfidences_0 =
        function () {
            return (Zf = b._emscripten_bind_TessBaseAPI_AllWordConfidences_0 = b.asm.Rd).apply(null, arguments)
        },
        $f = b._emscripten_bind_TessBaseAPI_AdaptToWordStr_2 = function () {
            return ($f = b._emscripten_bind_TessBaseAPI_AdaptToWordStr_2 = b.asm.Sd).apply(null, arguments)
        },
        ag = b._emscripten_bind_TessBaseAPI_Clear_0 = function () {
            return (ag = b._emscripten_bind_TessBaseAPI_Clear_0 = b.asm.Td).apply(null, arguments)
        },
        bg = b._emscripten_bind_TessBaseAPI_End_0 = function () {
            return (bg = b._emscripten_bind_TessBaseAPI_End_0 = b.asm.Ud).apply(null,
                arguments)
        },
        cg = b._emscripten_bind_TessBaseAPI_ClearPersistentCache_0 = function () {
            return (cg = b._emscripten_bind_TessBaseAPI_ClearPersistentCache_0 = b.asm.Vd).apply(null, arguments)
        },
        dg = b._emscripten_bind_TessBaseAPI_IsValidWord_1 = function () {
            return (dg = b._emscripten_bind_TessBaseAPI_IsValidWord_1 = b.asm.Wd).apply(null, arguments)
        },
        eg = b._emscripten_bind_TessBaseAPI_IsValidCharacter_1 = function () {
            return (eg = b._emscripten_bind_TessBaseAPI_IsValidCharacter_1 = b.asm.Xd).apply(null, arguments)
        },
        fg = b._emscripten_bind_TessBaseAPI_DetectOS_1 =
        function () {
            return (fg = b._emscripten_bind_TessBaseAPI_DetectOS_1 = b.asm.Yd).apply(null, arguments)
        },
        gg = b._emscripten_bind_TessBaseAPI_GetUnichar_1 = function () {
            return (gg = b._emscripten_bind_TessBaseAPI_GetUnichar_1 = b.asm.Zd).apply(null, arguments)
        },
        hg = b._emscripten_bind_TessBaseAPI_GetDawg_1 = function () {
            return (hg = b._emscripten_bind_TessBaseAPI_GetDawg_1 = b.asm._d).apply(null, arguments)
        },
        ig = b._emscripten_bind_TessBaseAPI_NumDawgs_0 = function () {
            return (ig = b._emscripten_bind_TessBaseAPI_NumDawgs_0 = b.asm.$d).apply(null,
                arguments)
        },
        jg = b._emscripten_bind_TessBaseAPI_oem_0 = function () {
            return (jg = b._emscripten_bind_TessBaseAPI_oem_0 = b.asm.ae).apply(null, arguments)
        },
        kg = b._emscripten_bind_TessBaseAPI___destroy___0 = function () {
            return (kg = b._emscripten_bind_TessBaseAPI___destroy___0 = b.asm.be).apply(null, arguments)
        },
        lg = b._emscripten_bind_OSResults_OSResults_0 = function () {
            return (lg = b._emscripten_bind_OSResults_OSResults_0 = b.asm.ce).apply(null, arguments)
        },
        mg = b._emscripten_bind_OSResults_print_scores_0 = function () {
            return (mg = b._emscripten_bind_OSResults_print_scores_0 =
                    b.asm.de).apply(null, arguments)
        },
        ng = b._emscripten_bind_OSResults_get_best_result_0 = function () {
            return (ng = b._emscripten_bind_OSResults_get_best_result_0 = b.asm.ee).apply(null, arguments)
        },
        og = b._emscripten_bind_OSResults_get_unicharset_0 = function () {
            return (og = b._emscripten_bind_OSResults_get_unicharset_0 = b.asm.fe).apply(null, arguments)
        },
        pg = b._emscripten_bind_OSResults___destroy___0 = function () {
            return (pg = b._emscripten_bind_OSResults___destroy___0 = b.asm.ge).apply(null, arguments)
        },
        qg = b._emscripten_bind_Pixa_get_n_0 =
        function () {
            return (qg = b._emscripten_bind_Pixa_get_n_0 = b.asm.he).apply(null, arguments)
        },
        rg = b._emscripten_bind_Pixa_get_nalloc_0 = function () {
            return (rg = b._emscripten_bind_Pixa_get_nalloc_0 = b.asm.ie).apply(null, arguments)
        },
        sg = b._emscripten_bind_Pixa_get_refcount_0 = function () {
            return (sg = b._emscripten_bind_Pixa_get_refcount_0 = b.asm.je).apply(null, arguments)
        },
        tg = b._emscripten_bind_Pixa_get_pix_0 = function () {
            return (tg = b._emscripten_bind_Pixa_get_pix_0 = b.asm.ke).apply(null, arguments)
        },
        ug = b._emscripten_bind_Pixa_get_boxa_0 =
        function () {
            return (ug = b._emscripten_bind_Pixa_get_boxa_0 = b.asm.le).apply(null, arguments)
        },
        vg = b._emscripten_bind_Pixa___destroy___0 = function () {
            return (vg = b._emscripten_bind_Pixa___destroy___0 = b.asm.me).apply(null, arguments)
        },
        wg = b._emscripten_enum_PageIteratorLevel_RIL_BLOCK = function () {
            return (wg = b._emscripten_enum_PageIteratorLevel_RIL_BLOCK = b.asm.ne).apply(null, arguments)
        },
        xg = b._emscripten_enum_PageIteratorLevel_RIL_PARA = function () {
            return (xg = b._emscripten_enum_PageIteratorLevel_RIL_PARA = b.asm.oe).apply(null,
                arguments)
        },
        yg = b._emscripten_enum_PageIteratorLevel_RIL_TEXTLINE = function () {
            return (yg = b._emscripten_enum_PageIteratorLevel_RIL_TEXTLINE = b.asm.pe).apply(null, arguments)
        },
        zg = b._emscripten_enum_PageIteratorLevel_RIL_WORD = function () {
            return (zg = b._emscripten_enum_PageIteratorLevel_RIL_WORD = b.asm.qe).apply(null, arguments)
        },
        Ag = b._emscripten_enum_PageIteratorLevel_RIL_SYMBOL = function () {
            return (Ag = b._emscripten_enum_PageIteratorLevel_RIL_SYMBOL = b.asm.re).apply(null, arguments)
        },
        Bg = b._emscripten_enum_OcrEngineMode_OEM_TESSERACT_ONLY =
        function () {
            return (Bg = b._emscripten_enum_OcrEngineMode_OEM_TESSERACT_ONLY = b.asm.se).apply(null, arguments)
        },
        Cg = b._emscripten_enum_OcrEngineMode_OEM_LSTM_ONLY = function () {
            return (Cg = b._emscripten_enum_OcrEngineMode_OEM_LSTM_ONLY = b.asm.te).apply(null, arguments)
        },
        Dg = b._emscripten_enum_OcrEngineMode_OEM_TESSERACT_LSTM_COMBINED = function () {
            return (Dg = b._emscripten_enum_OcrEngineMode_OEM_TESSERACT_LSTM_COMBINED = b.asm.ue).apply(null, arguments)
        },
        Eg = b._emscripten_enum_OcrEngineMode_OEM_DEFAULT = function () {
            return (Eg =
                    b._emscripten_enum_OcrEngineMode_OEM_DEFAULT = b.asm.ve).apply(null, arguments)
        },
        Fg = b._emscripten_enum_OcrEngineMode_OEM_COUNT = function () {
            return (Fg = b._emscripten_enum_OcrEngineMode_OEM_COUNT = b.asm.we).apply(null, arguments)
        },
        Gg = b._emscripten_enum_WritingDirection__WRITING_DIRECTION_LEFT_TO_RIGHT = function () {
            return (Gg = b._emscripten_enum_WritingDirection__WRITING_DIRECTION_LEFT_TO_RIGHT = b.asm.xe).apply(null, arguments)
        },
        Hg = b._emscripten_enum_WritingDirection__WRITING_DIRECTION_RIGHT_TO_LEFT = function () {
            return (Hg =
                    b._emscripten_enum_WritingDirection__WRITING_DIRECTION_RIGHT_TO_LEFT = b.asm.ye).apply(null, arguments)
        },
        Ig = b._emscripten_enum_WritingDirection__WRITING_DIRECTION_TOP_TO_BOTTOM = function () {
            return (Ig = b._emscripten_enum_WritingDirection__WRITING_DIRECTION_TOP_TO_BOTTOM = b.asm.ze).apply(null, arguments)
        },
        Jg = b._emscripten_enum_PolyBlockType_PT_UNKNOWN = function () {
            return (Jg = b._emscripten_enum_PolyBlockType_PT_UNKNOWN = b.asm.Ae).apply(null, arguments)
        },
        Kg = b._emscripten_enum_PolyBlockType_PT_FLOWING_TEXT = function () {
            return (Kg =
                    b._emscripten_enum_PolyBlockType_PT_FLOWING_TEXT = b.asm.Be).apply(null, arguments)
        },
        Lg = b._emscripten_enum_PolyBlockType_PT_HEADING_TEXT = function () {
            return (Lg = b._emscripten_enum_PolyBlockType_PT_HEADING_TEXT = b.asm.Ce).apply(null, arguments)
        },
        Mg = b._emscripten_enum_PolyBlockType_PT_PULLOUT_TEXT = function () {
            return (Mg = b._emscripten_enum_PolyBlockType_PT_PULLOUT_TEXT = b.asm.De).apply(null, arguments)
        },
        Ng = b._emscripten_enum_PolyBlockType_PT_EQUATION = function () {
            return (Ng = b._emscripten_enum_PolyBlockType_PT_EQUATION =
                    b.asm.Ee).apply(null, arguments)
        },
        Og = b._emscripten_enum_PolyBlockType_PT_INLINE_EQUATION = function () {
            return (Og = b._emscripten_enum_PolyBlockType_PT_INLINE_EQUATION = b.asm.Fe).apply(null, arguments)
        },
        Pg = b._emscripten_enum_PolyBlockType_PT_TABLE = function () {
            return (Pg = b._emscripten_enum_PolyBlockType_PT_TABLE = b.asm.Ge).apply(null, arguments)
        },
        Qg = b._emscripten_enum_PolyBlockType_PT_VERTICAL_TEXT = function () {
            return (Qg = b._emscripten_enum_PolyBlockType_PT_VERTICAL_TEXT = b.asm.He).apply(null, arguments)
        },
        Rg = b._emscripten_enum_PolyBlockType_PT_CAPTION_TEXT =
        function () {
            return (Rg = b._emscripten_enum_PolyBlockType_PT_CAPTION_TEXT = b.asm.Ie).apply(null, arguments)
        },
        Sg = b._emscripten_enum_PolyBlockType_PT_FLOWING_IMAGE = function () {
            return (Sg = b._emscripten_enum_PolyBlockType_PT_FLOWING_IMAGE = b.asm.Je).apply(null, arguments)
        },
        Tg = b._emscripten_enum_PolyBlockType_PT_HEADING_IMAGE = function () {
            return (Tg = b._emscripten_enum_PolyBlockType_PT_HEADING_IMAGE = b.asm.Ke).apply(null, arguments)
        },
        Ug = b._emscripten_enum_PolyBlockType_PT_PULLOUT_IMAGE = function () {
            return (Ug = b._emscripten_enum_PolyBlockType_PT_PULLOUT_IMAGE =
                    b.asm.Le).apply(null, arguments)
        },
        Vg = b._emscripten_enum_PolyBlockType_PT_HORZ_LINE = function () {
            return (Vg = b._emscripten_enum_PolyBlockType_PT_HORZ_LINE = b.asm.Me).apply(null, arguments)
        },
        Wg = b._emscripten_enum_PolyBlockType_PT_VERT_LINE = function () {
            return (Wg = b._emscripten_enum_PolyBlockType_PT_VERT_LINE = b.asm.Ne).apply(null, arguments)
        },
        Xg = b._emscripten_enum_PolyBlockType_PT_NOISE = function () {
            return (Xg = b._emscripten_enum_PolyBlockType_PT_NOISE = b.asm.Oe).apply(null, arguments)
        },
        Yg = b._emscripten_enum_PolyBlockType_PT_COUNT =
        function () {
            return (Yg = b._emscripten_enum_PolyBlockType_PT_COUNT = b.asm.Pe).apply(null, arguments)
        },
        Zg = b._emscripten_enum_StrongScriptDirection_DIR_NEUTRAL = function () {
            return (Zg = b._emscripten_enum_StrongScriptDirection_DIR_NEUTRAL = b.asm.Qe).apply(null, arguments)
        },
        $g = b._emscripten_enum_StrongScriptDirection_DIR_LEFT_TO_RIGHT = function () {
            return ($g = b._emscripten_enum_StrongScriptDirection_DIR_LEFT_TO_RIGHT = b.asm.Re).apply(null, arguments)
        },
        ah = b._emscripten_enum_StrongScriptDirection_DIR_RIGHT_TO_LEFT = function () {
            return (ah =
                    b._emscripten_enum_StrongScriptDirection_DIR_RIGHT_TO_LEFT = b.asm.Se).apply(null, arguments)
        },
        bh = b._emscripten_enum_StrongScriptDirection_DIR_MIX = function () {
            return (bh = b._emscripten_enum_StrongScriptDirection_DIR_MIX = b.asm.Te).apply(null, arguments)
        },
        ch = b._emscripten_enum_ParagraphJustification__JUSTIFICATION_UNKNOWN = function () {
            return (ch = b._emscripten_enum_ParagraphJustification__JUSTIFICATION_UNKNOWN = b.asm.Ue).apply(null, arguments)
        },
        dh = b._emscripten_enum_ParagraphJustification__JUSTIFICATION_LEFT = function () {
            return (dh =
                    b._emscripten_enum_ParagraphJustification__JUSTIFICATION_LEFT = b.asm.Ve).apply(null, arguments)
        },
        eh = b._emscripten_enum_ParagraphJustification__JUSTIFICATION_CENTER = function () {
            return (eh = b._emscripten_enum_ParagraphJustification__JUSTIFICATION_CENTER = b.asm.We).apply(null, arguments)
        },
        fh = b._emscripten_enum_ParagraphJustification__JUSTIFICATION_RIGHT = function () {
            return (fh = b._emscripten_enum_ParagraphJustification__JUSTIFICATION_RIGHT = b.asm.Xe).apply(null, arguments)
        },
        gh = b._emscripten_enum_TextlineOrder__TEXTLINE_ORDER_LEFT_TO_RIGHT =
        function () {
            return (gh = b._emscripten_enum_TextlineOrder__TEXTLINE_ORDER_LEFT_TO_RIGHT = b.asm.Ye).apply(null, arguments)
        },
        hh = b._emscripten_enum_TextlineOrder__TEXTLINE_ORDER_RIGHT_TO_LEFT = function () {
            return (hh = b._emscripten_enum_TextlineOrder__TEXTLINE_ORDER_RIGHT_TO_LEFT = b.asm.Ze).apply(null, arguments)
        },
        ih = b._emscripten_enum_TextlineOrder__TEXTLINE_ORDER_TOP_TO_BOTTOM = function () {
            return (ih = b._emscripten_enum_TextlineOrder__TEXTLINE_ORDER_TOP_TO_BOTTOM = b.asm._e).apply(null, arguments)
        },
        jh = b._emscripten_enum_Orientation__ORIENTATION_PAGE_UP =
        function () {
            return (jh = b._emscripten_enum_Orientation__ORIENTATION_PAGE_UP = b.asm.$e).apply(null, arguments)
        },
        kh = b._emscripten_enum_Orientation__ORIENTATION_PAGE_RIGHT = function () {
            return (kh = b._emscripten_enum_Orientation__ORIENTATION_PAGE_RIGHT = b.asm.af).apply(null, arguments)
        },
        lh = b._emscripten_enum_Orientation__ORIENTATION_PAGE_DOWN = function () {
            return (lh = b._emscripten_enum_Orientation__ORIENTATION_PAGE_DOWN = b.asm.bf).apply(null, arguments)
        },
        mh = b._emscripten_enum_Orientation__ORIENTATION_PAGE_LEFT = function () {
            return (mh =
                    b._emscripten_enum_Orientation__ORIENTATION_PAGE_LEFT = b.asm.cf).apply(null, arguments)
        },
        nh = b._emscripten_enum_PageSegMode_PSM_OSD_ONLY = function () {
            return (nh = b._emscripten_enum_PageSegMode_PSM_OSD_ONLY = b.asm.df).apply(null, arguments)
        },
        oh = b._emscripten_enum_PageSegMode_PSM_AUTO_OSD = function () {
            return (oh = b._emscripten_enum_PageSegMode_PSM_AUTO_OSD = b.asm.ef).apply(null, arguments)
        },
        ph = b._emscripten_enum_PageSegMode_PSM_AUTO_ONLY = function () {
            return (ph = b._emscripten_enum_PageSegMode_PSM_AUTO_ONLY = b.asm.ff).apply(null,
                arguments)
        },
        qh = b._emscripten_enum_PageSegMode_PSM_AUTO = function () {
            return (qh = b._emscripten_enum_PageSegMode_PSM_AUTO = b.asm.gf).apply(null, arguments)
        },
        rh = b._emscripten_enum_PageSegMode_PSM_SINGLE_COLUMN = function () {
            return (rh = b._emscripten_enum_PageSegMode_PSM_SINGLE_COLUMN = b.asm.hf).apply(null, arguments)
        },
        sh = b._emscripten_enum_PageSegMode_PSM_SINGLE_BLOCK_VERT_TEXT = function () {
            return (sh = b._emscripten_enum_PageSegMode_PSM_SINGLE_BLOCK_VERT_TEXT = b.asm.jf).apply(null, arguments)
        },
        th = b._emscripten_enum_PageSegMode_PSM_SINGLE_BLOCK =
        function () {
            return (th = b._emscripten_enum_PageSegMode_PSM_SINGLE_BLOCK = b.asm.kf).apply(null, arguments)
        },
        uh = b._emscripten_enum_PageSegMode_PSM_SINGLE_LINE = function () {
            return (uh = b._emscripten_enum_PageSegMode_PSM_SINGLE_LINE = b.asm.lf).apply(null, arguments)
        },
        vh = b._emscripten_enum_PageSegMode_PSM_SINGLE_WORD = function () {
            return (vh = b._emscripten_enum_PageSegMode_PSM_SINGLE_WORD = b.asm.mf).apply(null, arguments)
        },
        wh = b._emscripten_enum_PageSegMode_PSM_CIRCLE_WORD = function () {
            return (wh = b._emscripten_enum_PageSegMode_PSM_CIRCLE_WORD =
                    b.asm.nf).apply(null, arguments)
        },
        xh = b._emscripten_enum_PageSegMode_PSM_SINGLE_CHAR = function () {
            return (xh = b._emscripten_enum_PageSegMode_PSM_SINGLE_CHAR = b.asm.of).apply(null, arguments)
        },
        yh = b._emscripten_enum_PageSegMode_PSM_SPARSE_TEXT = function () {
            return (yh = b._emscripten_enum_PageSegMode_PSM_SPARSE_TEXT = b.asm.pf).apply(null, arguments)
        },
        zh = b._emscripten_enum_PageSegMode_PSM_SPARSE_TEXT_OSD = function () {
            return (zh = b._emscripten_enum_PageSegMode_PSM_SPARSE_TEXT_OSD = b.asm.qf).apply(null, arguments)
        },
        Ah = b._emscripten_enum_PageSegMode_PSM_RAW_LINE =
        function () {
            return (Ah = b._emscripten_enum_PageSegMode_PSM_RAW_LINE = b.asm.rf).apply(null, arguments)
        },
        Bh = b._emscripten_enum_PageSegMode_PSM_COUNT = function () {
            return (Bh = b._emscripten_enum_PageSegMode_PSM_COUNT = b.asm.sf).apply(null, arguments)
        };
        b._pixDestroy = function () {
            return (b._pixDestroy = b.asm.uf).apply(null, arguments)
        };
        b._ptaDestroy = function () {
            return (b._ptaDestroy = b.asm.vf).apply(null, arguments)
        };
        b._pixaDestroy = function () {
            return (b._pixaDestroy = b.asm.wf).apply(null, arguments)
        };
        b._boxaDestroy = function () {
            return (b._boxaDestroy = b.asm.xf).apply(null, arguments)
        };
        b._pixReadMem = function () {
            return (b._pixReadMem = b.asm.yf).apply(null, arguments)
        };
        var Ob = b.___errno_location = function () {
            return (Ob = b.___errno_location = b.asm.zf).apply(null, arguments)
        },
        Ch = b._free = function () {
            return (Ch = b._free = b.asm.Af).apply(null, arguments)
        },
        zb = b._malloc = function () {
            return (zb = b._malloc = b.asm.Bf).apply(null, arguments)
        };
        b._pixReadHeaderMem = function () {
            return (b._pixReadHeaderMem = b.asm.Cf).apply(null, arguments)
        };
        var qb = b._emscripten_builtin_memalign = function () {
            return (qb = b._emscripten_builtin_memalign = b.asm.Df).apply(null, arguments)
        },
        F = b._setThrew = function () {
            return (F = b._setThrew = b.asm.Ef).apply(null, arguments)
        },
        Dh = b.stackSave = function () {
            return (Dh = b.stackSave = b.asm.Ff).apply(null, arguments)
        },
        Eh = b.stackRestore = function () {
            return (Eh = b.stackRestore = b.asm.Gf).apply(null, arguments)
        };
        b.___cxa_is_pointer_type = function () {
            return (b.___cxa_is_pointer_type = b.asm.Hf).apply(null, arguments)
        };
        b.___emscripten_embedded_file_data = 600112;
        function Rb(a, c, d, e) {
            var g = Dh();
            try {
                return Mb(a)(c, d, e)
            } catch (h) {
                Eh(g);
                if (h !== h + 0)
                    throw h;
                F(1, 0)
            }
        }
        function Ub(a, c) {
            var d = Dh();
            try {
                Mb(a)(c)
            } catch (e) {
                Eh(d);
                if (e !== e + 0)
                    throw e;
                F(1, 0)
            }
        }
        function Pb(a, c) {
            var d = Dh();
            try {
                return Mb(a)(c)
            } catch (e) {
                Eh(d);
                if (e !== e + 0)
                    throw e;
                F(1, 0)
            }
        }
        function Wb(a, c, d, e) {
            var g = Dh();
            try {
                Mb(a)(c, d, e)
            } catch (h) {
                Eh(g);
                if (h !== h + 0)
                    throw h;
                F(1, 0)
            }
        }
        function Vb(a, c, d) {
            var e = Dh();
            try {
                Mb(a)(c, d)
            } catch (g) {
                Eh(e);
                if (g !== g + 0)
                    throw g;
                F(1, 0)
            }
        }
        function Qb(a, c, d) {
            var e = Dh();
            try {
                return Mb(a)(c, d)
            } catch (g) {
                Eh(e);
                if (g !== g + 0)
                    throw g;
                F(1, 0)
            }
        }
        function Sb(a, c, d, e, g) {
            var h = Dh();
            try {
                return Mb(a)(c, d, e, g)
            } catch (k) {
                Eh(h);
                if (k !== k + 0)
                    throw k;
                F(1, 0)
            }
        }
        function Xb(a, c, d, e, g) {
            var h = Dh();
            try {
                Mb(a)(c, d, e, g)
            } catch (k) {
                Eh(h);
                if (k !== k + 0)
                    throw k;
                F(1, 0)
            }
        }
        function Tb(a, c, d, e, g, h) {
            var k = Dh();
            try {
                return Mb(a)(c, d, e, g, h)
            } catch (m) {
                Eh(k);
                if (m !== m + 0)
                    throw m;
                F(1, 0)
            }
        }
        function Zb(a, c, d, e, g, h, k, m, t, u) {
            var p = Dh();
            try {
                Mb(a)(c, d, e, g, h, k, m, t, u)
            } catch (x) {
                Eh(p);
                if (x !== x + 0)
                    throw x;
                F(1, 0)
            }
        }
        function Yb(a, c, d, e, g, h) {
            var k = Dh();
            try {
                Mb(a)(c, d, e, g, h)
            } catch (m) {
                Eh(k);
                if (m !== m + 0)
                    throw m;
                F(1, 0)
            }
        }
        b.addRunDependency = Qa;
        b.removeRunDependency = Ra;
        b.FS_createPath = D.Lg;
        b.FS_createDataFile = D.wg;
        b.FS_createPreloadedFile = D.oh;
        b.FS_createLazyFile = D.nh;
        b.FS_createDevice = D.Wf;
        b.FS_unlink = D.unlink;
        b.setValue = Za;
        b.getValue = Ya;
        b.FS = D;
        var Fh;
        Pa = function Gh() {
            Fh || Hh();
            Fh || (Pa = Gh)
        };
        function Hh() {
            function a() {
                if (!Fh && (Fh = !0, b.calledRun = !0, !ua)) {
                    La = !0;
                    b.noFSInit || D.rg.Xg || D.rg();
                    D.Ah = !1;
                    Xa(Ia);
                    aa(b);
                    if (b.onRuntimeInitialized)
                        b.onRuntimeInitialized();
                    if (b.postRun)
                        for ("function" == typeof b.postRun && (b.postRun = [b.postRun]); b.postRun.length; ) {
                            var c = b.postRun.shift();
                            Ka.unshift(c)
                        }
                    Xa(Ka)
                }
            }
            if (!(0 < Na)) {
                if (b.preRun)
                    for ("function" == typeof b.preRun && (b.preRun = [b.preRun]); b.preRun.length; )
                        Ma();
                Xa(Ha);
                0 < Na || (b.setStatus ? (b.setStatus("Running..."), setTimeout(function () {
                            setTimeout(function () {
                                b.setStatus("")
                            },
                                1);
                            a()
                        }, 1)) : a())
            }
        }
        if (b.preInit)
            for ("function" == typeof b.preInit && (b.preInit = [b.preInit]); 0 < b.preInit.length; )
                b.preInit.pop()();
        Hh();
        function G() {}
        G.prototype = Object.create(G.prototype);
        G.prototype.constructor = G;
        G.prototype.Nf = G;
        G.Of = {};
        b.WrapperObject = G;
        function Ih(a) {
            return (a || G).Of
        }
        b.getCache = Ih;
        function H(a, c) {
            var d = Ih(c),
            e = d[a];
            if (e)
                return e;
            e = Object.create((c || G).prototype);
            e.If = a;
            return d[a] = e
        }
        b.wrapPointer = H;
        b.castObject = function (a, c) {
            return H(a.If, c)
        };
        b.NULL = H(0);
        b.destroy = function (a) {
            if (!a.__destroy__)
                throw "Error: Cannot destroy object. (Did you create it yourself?)";
            a.__destroy__();
            delete Ih(a.Nf)[a.If]
        };
        b.compare = function (a, c) {
            return a.If === c.If
        };
        b.getPointer = function (a) {
            return a.If
        };
        b.getClass = function (a) {
            return a.Nf
        };
        var Jh = 0,
        Kh = 0,
        Lh = 0,
        Mh = [],
        Nh = 0;
        function I() {
            if (Nh) {
                for (var a = 0; a < Mh.length; a++)
                    b._free(Mh[a]);
                Mh.length = 0;
                b._free(Jh);
                Jh = 0;
                Kh += Nh;
                Nh = 0
            }
            Jh || (Kh += 128, (Jh = b._malloc(Kh)) || n());
            Lh = 0
        }
        function J(a) {
            if ("string" === typeof a) {
                a = jb(a);
                var c = r;
                Jh || n();
                c = a.length * c.BYTES_PER_ELEMENT;
                c = c + 7 & -8;
                if (Lh + c >= Kh) {
                    0 < c || n();
                    Nh += c;
                    var d = b._malloc(c);
                    Mh.push(d)
                } else
                    d = Jh + Lh, Lh += c;
                c = d;
                d = r;
                var e = c;
                switch (d.BYTES_PER_ELEMENT) {
                case 2:
                    e >>= 1;
                    break;
                case 4:
                    e >>= 2;
                    break;
                case 8:
                    e >>= 3
                }
                for (var g = 0; g < a.length; g++)
                    d[e + g] = a[g];
                return c
            }
            return a
        }
        function Oh() {
            throw "cannot construct a ParagraphJustification, no constructor in IDL";
        }
        Oh.prototype = Object.create(G.prototype);
        Oh.prototype.constructor = Oh;
        Oh.prototype.Nf = Oh;
        Oh.Of = {};
        b.ParagraphJustification = Oh;
        Oh.prototype.__destroy__ = function () {
            ac(this.If)
        };
        function Ph() {
            throw "cannot construct a BoolPtr, no constructor in IDL";
        }
        Ph.prototype = Object.create(G.prototype);
        Ph.prototype.constructor = Ph;
        Ph.prototype.Nf = Ph;
        Ph.Of = {};
        b.BoolPtr = Ph;
        Ph.prototype.__destroy__ = function () {
            bc(this.If)
        };
        function K() {
            throw "cannot construct a TessResultRenderer, no constructor in IDL";
        }
        K.prototype = Object.create(G.prototype);
        K.prototype.constructor = K;
        K.prototype.Nf = K;
        K.Of = {};
        b.TessResultRenderer = K;
        K.prototype.BeginDocument = function (a) {
            var c = this.If;
            I();
            a = a && "object" === typeof a ? a.If : J(a);
            return !!cc(c, a)
        };
        K.prototype.AddImage = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return !!dc(c, a)
        };
        K.prototype.EndDocument = function () {
            return !!ec(this.If)
        };
        K.prototype.happy = function () {
            return !!fc(this.If)
        };
        K.prototype.file_extension = function () {
            return q(gc(this.If))
        };
        K.prototype.title = K.prototype.title = function () {
            return q(hc(this.If))
        };
        K.prototype.imagenum = function () {
            return ic(this.If)
        };
        K.prototype.__destroy__ = function () {
            jc(this.If)
        };
        function Qh() {
            throw "cannot construct a LongStarPtr, no constructor in IDL";
        }
        Qh.prototype = Object.create(G.prototype);
        Qh.prototype.constructor = Qh;
        Qh.prototype.Nf = Qh;
        Qh.Of = {};
        b.LongStarPtr = Qh;
        Qh.prototype.__destroy__ = function () {
            kc(this.If)
        };
        function Rh() {
            throw "cannot construct a VoidPtr, no constructor in IDL";
        }
        Rh.prototype = Object.create(G.prototype);
        Rh.prototype.constructor = Rh;
        Rh.prototype.Nf = Rh;
        Rh.Of = {};
        b.VoidPtr = Rh;
        Rh.prototype.__destroy__ = function () {
            lc(this.If)
        };
        function L(a) {
            a && "object" === typeof a && (a = a.If);
            this.If = mc(a);
            Ih(L)[this.If] = this
        }
        L.prototype = Object.create(G.prototype);
        L.prototype.constructor = L;
        L.prototype.Nf = L;
        L.Of = {};
        b.ResultIterator = L;
        L.prototype.Begin = function () {
            nc(this.If)
        };
        L.prototype.RestartParagraph = function () {
            oc(this.If)
        };
        L.prototype.IsWithinFirstTextlineOfParagraph = function () {
            return !!pc(this.If)
        };
        L.prototype.RestartRow = function () {
            qc(this.If)
        };
        L.prototype.Next = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return !!rc(c, a)
        };
        L.prototype.IsAtBeginningOf = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return !!sc(c, a)
        };
        L.prototype.IsAtFinalElement = function (a, c) {
            var d = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            return !!tc(d, a, c)
        };
        L.prototype.Cmp = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return uc(c, a)
        };
        L.prototype.SetBoundingBoxComponents = function (a, c) {
            var d = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            vc(d, a, c)
        };
        L.prototype.BoundingBox = function (a, c, d, e, g, h) {
            var k = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            d && "object" === typeof d && (d = d.If);
            e && "object" === typeof e && (e = e.If);
            g && "object" === typeof g && (g = g.If);
            h && "object" === typeof h && (h = h.If);
            return void 0 === h ? !!wc(k, a, c, d, e, g) : !!xc(k, a, c, d, e, g, h)
        };
        L.prototype.BoundingBoxInternal = function (a, c, d, e, g) {
            var h = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            d && "object" === typeof d && (d = d.If);
            e && "object" === typeof e && (e = e.If);
            g && "object" === typeof g && (g = g.If);
            return !!yc(h, a, c, d, e, g)
        };
        L.prototype.Empty = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return !!zc(c, a)
        };
        L.prototype.BlockType = function () {
            return Ac(this.If)
        };
        L.prototype.BlockPolygon = function () {
            return H(Bc(this.If), M)
        };
        L.prototype.GetBinaryImage = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return H(Cc(c, a), O)
        };
        L.prototype.GetImage = function (a, c, d, e, g) {
            var h = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            d && "object" === typeof d && (d = d.If);
            e && "object" === typeof e && (e = e.If);
            g && "object" === typeof g && (g = g.If);
            return H(Dc(h, a, c, d, e, g), O)
        };
        L.prototype.Baseline = function (a, c, d, e, g) {
            var h = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            d && "object" === typeof d && (d = d.If);
            e && "object" === typeof e && (e = e.If);
            g && "object" === typeof g && (g = g.If);
            return !!Ec(h, a, c, d, e, g)
        };
        L.prototype.Orientation = function (a, c, d, e) {
            var g = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            d && "object" === typeof d && (d = d.If);
            e && "object" === typeof e && (e = e.If);
            Fc(g, a, c, d, e)
        };
        L.prototype.ParagraphInfo = function (a, c, d, e) {
            var g = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            d && "object" === typeof d && (d = d.If);
            e && "object" === typeof e && (e = e.If);
            Gc(g, a, c, d, e)
        };
        L.prototype.ParagraphIsLtr = function () {
            return !!Hc(this.If)
        };
        L.prototype.GetUTF8Text = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return q(Ic(c, a))
        };
        L.prototype.SetLineSeparator = function (a) {
            var c = this.If;
            I();
            a = a && "object" === typeof a ? a.If : J(a);
            Jc(c, a)
        };
        L.prototype.SetParagraphSeparator = function (a) {
            var c = this.If;
            I();
            a = a && "object" === typeof a ? a.If : J(a);
            Kc(c, a)
        };
        L.prototype.Confidence = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return Lc(c, a)
        };
        L.prototype.WordFontAttributes = function (a, c, d, e, g, h, k, m) {
            var t = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            d && "object" === typeof d && (d = d.If);
            e && "object" === typeof e && (e = e.If);
            g && "object" === typeof g && (g = g.If);
            h && "object" === typeof h && (h = h.If);
            k && "object" === typeof k && (k = k.If);
            m && "object" === typeof m && (m = m.If);
            return q(Mc(t, a, c, d, e, g, h, k, m))
        };
        L.prototype.WordRecognitionLanguage = function () {
            return q(Nc(this.If))
        };
        L.prototype.WordDirection = function () {
            return Oc(this.If)
        };
        L.prototype.WordIsFromDictionary = function () {
            return !!Pc(this.If)
        };
        L.prototype.WordIsNumeric = function () {
            return !!Qc(this.If)
        };
        L.prototype.HasBlamerInfo = function () {
            return !!Rc(this.If)
        };
        L.prototype.HasTruthString = function () {
            return !!Sc(this.If)
        };
        L.prototype.EquivalentToTruth = function (a) {
            var c = this.If;
            I();
            a = a && "object" === typeof a ? a.If : J(a);
            return !!Tc(c, a)
        };
        L.prototype.WordTruthUTF8Text = function () {
            return q(Uc(this.If))
        };
        L.prototype.WordNormedUTF8Text = function () {
            return q(Vc(this.If))
        };
        L.prototype.WordLattice = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return q(Wc(c, a))
        };
        L.prototype.SymbolIsSuperscript = function () {
            return !!Xc(this.If)
        };
        L.prototype.SymbolIsSubscript = function () {
            return !!Yc(this.If)
        };
        L.prototype.SymbolIsDropcap = function () {
            return !!Zc(this.If)
        };
        L.prototype.__destroy__ = function () {
            $c(this.If)
        };
        function Th() {
            throw "cannot construct a TextlineOrder, no constructor in IDL";
        }
        Th.prototype = Object.create(G.prototype);
        Th.prototype.constructor = Th;
        Th.prototype.Nf = Th;
        Th.Of = {};
        b.TextlineOrder = Th;
        Th.prototype.__destroy__ = function () {
            ad(this.If)
        };
        function Uh() {
            throw "cannot construct a ETEXT_DESC, no constructor in IDL";
        }
        Uh.prototype = Object.create(G.prototype);
        Uh.prototype.constructor = Uh;
        Uh.prototype.Nf = Uh;
        Uh.Of = {};
        b.ETEXT_DESC = Uh;
        Uh.prototype.__destroy__ = function () {
            bd(this.If)
        };
        function P() {
            throw "cannot construct a PageIterator, no constructor in IDL";
        }
        P.prototype = Object.create(G.prototype);
        P.prototype.constructor = P;
        P.prototype.Nf = P;
        P.Of = {};
        b.PageIterator = P;
        P.prototype.Begin = function () {
            cd(this.If)
        };
        P.prototype.RestartParagraph = function () {
            dd(this.If)
        };
        P.prototype.IsWithinFirstTextlineOfParagraph = function () {
            return !!ed(this.If)
        };
        P.prototype.RestartRow = function () {
            fd(this.If)
        };
        P.prototype.Next = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return !!gd(c, a)
        };
        P.prototype.IsAtBeginningOf = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return !!hd(c, a)
        };
        P.prototype.IsAtFinalElement = function (a, c) {
            var d = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            return !!jd(d, a, c)
        };
        P.prototype.Cmp = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return kd(c, a)
        };
        P.prototype.SetBoundingBoxComponents = function (a, c) {
            var d = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            ld(d, a, c)
        };
        P.prototype.BoundingBox = function (a, c, d, e, g, h) {
            var k = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            d && "object" === typeof d && (d = d.If);
            e && "object" === typeof e && (e = e.If);
            g && "object" === typeof g && (g = g.If);
            h && "object" === typeof h && (h = h.If);
            return void 0 === h ? !!md(k, a, c, d, e, g) : !!nd(k, a, c, d, e, g, h)
        };
        P.prototype.BoundingBoxInternal = function (a, c, d, e, g) {
            var h = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            d && "object" === typeof d && (d = d.If);
            e && "object" === typeof e && (e = e.If);
            g && "object" === typeof g && (g = g.If);
            return !!od(h, a, c, d, e, g)
        };
        P.prototype.Empty = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return !!pd(c, a)
        };
        P.prototype.BlockType = function () {
            return qd(this.If)
        };
        P.prototype.BlockPolygon = function () {
            return H(rd(this.If), M)
        };
        P.prototype.GetBinaryImage = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return H(sd(c, a), O)
        };
        P.prototype.GetImage = function (a, c, d, e, g) {
            var h = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            d && "object" === typeof d && (d = d.If);
            e && "object" === typeof e && (e = e.If);
            g && "object" === typeof g && (g = g.If);
            return H(td(h, a, c, d, e, g), O)
        };
        P.prototype.Baseline = function (a, c, d, e, g) {
            var h = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            d && "object" === typeof d && (d = d.If);
            e && "object" === typeof e && (e = e.If);
            g && "object" === typeof g && (g = g.If);
            return !!ud(h, a, c, d, e, g)
        };
        P.prototype.Orientation = function (a, c, d, e) {
            var g = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            d && "object" === typeof d && (d = d.If);
            e && "object" === typeof e && (e = e.If);
            vd(g, a, c, d, e)
        };
        P.prototype.ParagraphInfo = function (a, c, d, e) {
            var g = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            d && "object" === typeof d && (d = d.If);
            e && "object" === typeof e && (e = e.If);
            wd(g, a, c, d, e)
        };
        P.prototype.__destroy__ = function () {
            xd(this.If)
        };
        function Vh() {
            throw "cannot construct a WritingDirection, no constructor in IDL";
        }
        Vh.prototype = Object.create(G.prototype);
        Vh.prototype.constructor = Vh;
        Vh.prototype.Nf = Vh;
        Vh.Of = {};
        b.WritingDirection = Vh;
        Vh.prototype.__destroy__ = function () {
            yd(this.If)
        };
        function Wh(a) {
            a && "object" === typeof a && (a = a.If);
            this.If = zd(a);
            Ih(Wh)[this.If] = this
        }
        Wh.prototype = Object.create(G.prototype);
        Wh.prototype.constructor = Wh;
        Wh.prototype.Nf = Wh;
        Wh.Of = {};
        b.WordChoiceIterator = Wh;
        Wh.prototype.Next = function () {
            return !!Ad(this.If)
        };
        Wh.prototype.GetUTF8Text = function () {
            return q(Bd(this.If))
        };
        Wh.prototype.Confidence = function () {
            return Cd(this.If)
        };
        Wh.prototype.__destroy__ = function () {
            Dd(this.If)
        };
        function Q() {
            throw "cannot construct a Box, no constructor in IDL";
        }
        Q.prototype = Object.create(G.prototype);
        Q.prototype.constructor = Q;
        Q.prototype.Nf = Q;
        Q.Of = {};
        b.Box = Q;
        Q.prototype.get_x = Q.prototype.Tg = function () {
            return Ed(this.If)
        };
        Object.defineProperty(Q.prototype, "x", {
            get: Q.prototype.Tg
        });
        Q.prototype.get_y = Q.prototype.Ug = function () {
            return Fd(this.If)
        };
        Object.defineProperty(Q.prototype, "y", {
            get: Q.prototype.Ug
        });
        Q.prototype.get_w = Q.prototype.Sg = function () {
            return Gd(this.If)
        };
        Object.defineProperty(Q.prototype, "w", {
            get: Q.prototype.Sg
        });
        Q.prototype.get_h = Q.prototype.Rg = function () {
            return Hd(this.If)
        };
        Object.defineProperty(Q.prototype, "h", {
            get: Q.prototype.Rg
        });
        Q.prototype.get_refcount = Q.prototype.cg = function () {
            return Id(this.If)
        };
        Object.defineProperty(Q.prototype, "refcount", {
            get: Q.prototype.cg
        });
        Q.prototype.__destroy__ = function () {
            Jd(this.If)
        };
        function R(a, c, d) {
            I();
            a = a && "object" === typeof a ? a.If : J(a);
            c = c && "object" === typeof c ? c.If : J(c);
            d && "object" === typeof d && (d = d.If);
            this.If = Kd(a, c, d);
            Ih(R)[this.If] = this
        }
        R.prototype = Object.create(G.prototype);
        R.prototype.constructor = R;
        R.prototype.Nf = R;
        R.Of = {};
        b.TessPDFRenderer = R;
        R.prototype.BeginDocument = function (a) {
            var c = this.If;
            I();
            a = a && "object" === typeof a ? a.If : J(a);
            return !!Ld(c, a)
        };
        R.prototype.AddImage = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return !!Md(c, a)
        };
        R.prototype.EndDocument = function () {
            return !!Nd(this.If)
        };
        R.prototype.happy = function () {
            return !!Od(this.If)
        };
        R.prototype.file_extension = function () {
            return q(Pd(this.If))
        };
        R.prototype.title = R.prototype.title = function () {
            return q(Qd(this.If))
        };
        R.prototype.imagenum = function () {
            return Rd(this.If)
        };
        R.prototype.__destroy__ = function () {
            Sd(this.If)
        };
        function Xh() {
            throw "cannot construct a PixaPtr, no constructor in IDL";
        }
        Xh.prototype = Object.create(G.prototype);
        Xh.prototype.constructor = Xh;
        Xh.prototype.Nf = Xh;
        Xh.Of = {};
        b.PixaPtr = Xh;
        Xh.prototype.__destroy__ = function () {
            Td(this.If)
        };
        function Yh() {
            throw "cannot construct a FloatPtr, no constructor in IDL";
        }
        Yh.prototype = Object.create(G.prototype);
        Yh.prototype.constructor = Yh;
        Yh.prototype.Nf = Yh;
        Yh.Of = {};
        b.FloatPtr = Yh;
        Yh.prototype.__destroy__ = function () {
            Ud(this.If)
        };
        function Zh(a) {
            a && "object" === typeof a && (a = a.If);
            this.If = Vd(a);
            Ih(Zh)[this.If] = this
        }
        Zh.prototype = Object.create(G.prototype);
        Zh.prototype.constructor = Zh;
        Zh.prototype.Nf = Zh;
        Zh.Of = {};
        b.ChoiceIterator = Zh;
        Zh.prototype.Next = function () {
            return !!Wd(this.If)
        };
        Zh.prototype.GetUTF8Text = function () {
            return q(Xd(this.If))
        };
        Zh.prototype.Confidence = function () {
            return Yd(this.If)
        };
        Zh.prototype.__destroy__ = function () {
            Zd(this.If)
        };
        function $h() {
            throw "cannot construct a PixPtr, no constructor in IDL";
        }
        $h.prototype = Object.create(G.prototype);
        $h.prototype.constructor = $h;
        $h.prototype.Nf = $h;
        $h.Of = {};
        b.PixPtr = $h;
        $h.prototype.__destroy__ = function () {
            $d(this.If)
        };
        function ai() {
            throw "cannot construct a UNICHARSET, no constructor in IDL";
        }
        ai.prototype = Object.create(G.prototype);
        ai.prototype.constructor = ai;
        ai.prototype.Nf = ai;
        ai.Of = {};
        b.UNICHARSET = ai;
        ai.prototype.get_script_from_script_id = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return q(ae(c, a))
        };
        ai.prototype.get_script_id_from_name = function (a) {
            var c = this.If;
            I();
            a = a && "object" === typeof a ? a.If : J(a);
            return be(c, a)
        };
        ai.prototype.get_script_table_size = function () {
            return ce(this.If)
        };
        ai.prototype.__destroy__ = function () {
            de(this.If)
        };
        function bi() {
            throw "cannot construct a IntPtr, no constructor in IDL";
        }
        bi.prototype = Object.create(G.prototype);
        bi.prototype.constructor = bi;
        bi.prototype.Nf = bi;
        bi.Of = {};
        b.IntPtr = bi;
        bi.prototype.__destroy__ = function () {
            ee(this.If)
        };
        function ci() {
            throw "cannot construct a Orientation, no constructor in IDL";
        }
        ci.prototype = Object.create(G.prototype);
        ci.prototype.constructor = ci;
        ci.prototype.Nf = ci;
        ci.Of = {};
        b.Orientation = ci;
        ci.prototype.__destroy__ = function () {
            fe(this.If)
        };
        function S() {
            throw "cannot construct a OSBestResult, no constructor in IDL";
        }
        S.prototype = Object.create(G.prototype);
        S.prototype.constructor = S;
        S.prototype.Nf = S;
        S.Of = {};
        b.OSBestResult = S;
        S.prototype.get_orientation_id = S.prototype.ii = function () {
            return ge(this.If)
        };
        Object.defineProperty(S.prototype, "orientation_id", {
            get: S.prototype.ii
        });
        S.prototype.get_script_id = S.prototype.li = function () {
            return he(this.If)
        };
        Object.defineProperty(S.prototype, "script_id", {
            get: S.prototype.li
        });
        S.prototype.get_sconfidence = S.prototype.ki = function () {
            return ie(this.If)
        };
        Object.defineProperty(S.prototype, "sconfidence", {
            get: S.prototype.ki
        });
        S.prototype.get_oconfidence = S.prototype.hi = function () {
            return je(this.If)
        };
        Object.defineProperty(S.prototype, "oconfidence", {
            get: S.prototype.hi
        });
        S.prototype.__destroy__ = function () {
            ke(this.If)
        };
        function T() {
            throw "cannot construct a Boxa, no constructor in IDL";
        }
        T.prototype = Object.create(G.prototype);
        T.prototype.constructor = T;
        T.prototype.Nf = T;
        T.Of = {};
        b.Boxa = T;
        T.prototype.get_n = T.prototype.hg = function () {
            return le(this.If)
        };
        Object.defineProperty(T.prototype, "n", {
            get: T.prototype.hg
        });
        T.prototype.get_nalloc = T.prototype.ig = function () {
            return me(this.If)
        };
        Object.defineProperty(T.prototype, "nalloc", {
            get: T.prototype.ig
        });
        T.prototype.get_refcount = T.prototype.cg = function () {
            return ne(this.If)
        };
        Object.defineProperty(T.prototype, "refcount", {
            get: T.prototype.cg
        });
        T.prototype.get_box = T.prototype.ai = function () {
            return H(oe(this.If), di)
        };
        Object.defineProperty(T.prototype, "box", {
            get: T.prototype.ai
        });
        T.prototype.__destroy__ = function () {
            pe(this.If)
        };
        function V() {
            throw "cannot construct a PixColormap, no constructor in IDL";
        }
        V.prototype = Object.create(G.prototype);
        V.prototype.constructor = V;
        V.prototype.Nf = V;
        V.Of = {};
        b.PixColormap = V;
        V.prototype.get_array = V.prototype.Zh = function () {
            return qe(this.If)
        };
        Object.defineProperty(V.prototype, "array", {
            get: V.prototype.Zh
        });
        V.prototype.get_depth = V.prototype.fi = function () {
            return re(this.If)
        };
        Object.defineProperty(V.prototype, "depth", {
            get: V.prototype.fi
        });
        V.prototype.get_nalloc = V.prototype.ig = function () {
            return se(this.If)
        };
        Object.defineProperty(V.prototype, "nalloc", {
            get: V.prototype.ig
        });
        V.prototype.get_n = V.prototype.hg = function () {
            return te(this.If)
        };
        Object.defineProperty(V.prototype, "n", {
            get: V.prototype.hg
        });
        V.prototype.__destroy__ = function () {
            ue(this.If)
        };
        function M() {
            throw "cannot construct a Pta, no constructor in IDL";
        }
        M.prototype = Object.create(G.prototype);
        M.prototype.constructor = M;
        M.prototype.Nf = M;
        M.Of = {};
        b.Pta = M;
        M.prototype.get_n = M.prototype.hg = function () {
            return ve(this.If)
        };
        Object.defineProperty(M.prototype, "n", {
            get: M.prototype.hg
        });
        M.prototype.get_nalloc = M.prototype.ig = function () {
            return we(this.If)
        };
        Object.defineProperty(M.prototype, "nalloc", {
            get: M.prototype.ig
        });
        M.prototype.get_refcount = M.prototype.cg = function () {
            return xe(this.If)
        };
        Object.defineProperty(M.prototype, "refcount", {
            get: M.prototype.cg
        });
        M.prototype.get_x = M.prototype.Tg = function () {
            return H(ye(this.If), Yh)
        };
        Object.defineProperty(M.prototype, "x", {
            get: M.prototype.Tg
        });
        M.prototype.get_y = M.prototype.Ug = function () {
            return H(ze(this.If), Yh)
        };
        Object.defineProperty(M.prototype, "y", {
            get: M.prototype.Ug
        });
        M.prototype.__destroy__ = function () {
            Ae(this.If)
        };
        function O() {
            throw "cannot construct a Pix, no constructor in IDL";
        }
        O.prototype = Object.create(G.prototype);
        O.prototype.constructor = O;
        O.prototype.Nf = O;
        O.Of = {};
        b.Pix = O;
        O.prototype.get_w = O.prototype.Sg = function () {
            return Be(this.If)
        };
        Object.defineProperty(O.prototype, "w", {
            get: O.prototype.Sg
        });
        O.prototype.get_h = O.prototype.Rg = function () {
            return Ce(this.If)
        };
        Object.defineProperty(O.prototype, "h", {
            get: O.prototype.Rg
        });
        O.prototype.get_d = O.prototype.di = function () {
            return De(this.If)
        };
        Object.defineProperty(O.prototype, "d", {
            get: O.prototype.di
        });
        O.prototype.get_spp = O.prototype.ni = function () {
            return Ee(this.If)
        };
        Object.defineProperty(O.prototype, "spp", {
            get: O.prototype.ni
        });
        O.prototype.get_wpl = O.prototype.ri = function () {
            return Fe(this.If)
        };
        Object.defineProperty(O.prototype, "wpl", {
            get: O.prototype.ri
        });
        O.prototype.get_refcount = O.prototype.cg = function () {
            return Ge(this.If)
        };
        Object.defineProperty(O.prototype, "refcount", {
            get: O.prototype.cg
        });
        O.prototype.get_xres = O.prototype.si = function () {
            return He(this.If)
        };
        Object.defineProperty(O.prototype, "xres", {
            get: O.prototype.si
        });
        O.prototype.get_yres = O.prototype.ti = function () {
            return Ie(this.If)
        };
        Object.defineProperty(O.prototype, "yres", {
            get: O.prototype.ti
        });
        O.prototype.get_informat = O.prototype.gi = function () {
            return Je(this.If)
        };
        Object.defineProperty(O.prototype, "informat", {
            get: O.prototype.gi
        });
        O.prototype.get_special = O.prototype.mi = function () {
            return Ke(this.If)
        };
        Object.defineProperty(O.prototype, "special", {
            get: O.prototype.mi
        });
        O.prototype.get_text = O.prototype.oi = function () {
            return q(Le(this.If))
        };
        Object.defineProperty(O.prototype, "text", {
            get: O.prototype.oi
        });
        O.prototype.get_colormap = O.prototype.ci = function () {
            return H(Me(this.If), V)
        };
        Object.defineProperty(O.prototype, "colormap", {
            get: O.prototype.ci
        });
        O.prototype.get_data = O.prototype.ei = function () {
            return Ne(this.If)
        };
        Object.defineProperty(O.prototype, "data", {
            get: O.prototype.ei
        });
        O.prototype.__destroy__ = function () {
            Oe(this.If)
        };
        function ei() {
            throw "cannot construct a DoublePtr, no constructor in IDL";
        }
        ei.prototype = Object.create(G.prototype);
        ei.prototype.constructor = ei;
        ei.prototype.Nf = ei;
        ei.Of = {};
        b.DoublePtr = ei;
        ei.prototype.__destroy__ = function () {
            Pe(this.If)
        };
        function fi() {
            throw "cannot construct a Dawg, no constructor in IDL";
        }
        fi.prototype = Object.create(G.prototype);
        fi.prototype.constructor = fi;
        fi.prototype.Nf = fi;
        fi.Of = {};
        b.Dawg = fi;
        fi.prototype.__destroy__ = function () {
            Qe(this.If)
        };
        function di() {
            throw "cannot construct a BoxPtr, no constructor in IDL";
        }
        di.prototype = Object.create(G.prototype);
        di.prototype.constructor = di;
        di.prototype.Nf = di;
        di.Of = {};
        b.BoxPtr = di;
        di.prototype.__destroy__ = function () {
            Re(this.If)
        };
        function X() {
            this.If = Se();
            Ih(X)[this.If] = this
        }
        X.prototype = Object.create(G.prototype);
        X.prototype.constructor = X;
        X.prototype.Nf = X;
        X.Of = {};
        b.TessBaseAPI = X;
        X.prototype.Version = function () {
            return q(Te(this.If))
        };
        X.prototype.SetInputName = function (a) {
            var c = this.If;
            I();
            a = a && "object" === typeof a ? a.If : J(a);
            Ue(c, a)
        };
        X.prototype.GetInputName = function () {
            return q(Ve(this.If))
        };
        X.prototype.SetInputImage = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            We(c, a)
        };
        X.prototype.GetInputImage = function () {
            return H(Xe(this.If), O)
        };
        X.prototype.GetSourceYResolution = function () {
            return Ye(this.If)
        };
        X.prototype.GetDatapath = function () {
            return q(Ze(this.If))
        };
        X.prototype.SetOutputName = function (a) {
            var c = this.If;
            I();
            a = a && "object" === typeof a ? a.If : J(a);
            $e(c, a)
        };
        X.prototype.SetVariable = X.prototype.SetVariable = function (a, c) {
            var d = this.If;
            I();
            a = a && "object" === typeof a ? a.If : J(a);
            c = c && "object" === typeof c ? c.If : J(c);
            return !!af(d, a, c)
        };
        X.prototype.SetDebugVariable = function (a, c) {
            var d = this.If;
            I();
            a = a && "object" === typeof a ? a.If : J(a);
            c = c && "object" === typeof c ? c.If : J(c);
            return !!bf(d, a, c)
        };
        X.prototype.GetIntVariable = function (a, c) {
            var d = this.If;
            I();
            a = a && "object" === typeof a ? a.If : J(a);
            c && "object" === typeof c && (c = c.If);
            return !!cf(d, a, c)
        };
        X.prototype.GetBoolVariable = function (a, c) {
            var d = this.If;
            I();
            a = a && "object" === typeof a ? a.If : J(a);
            c && "object" === typeof c && (c = c.If);
            return !!df(d, a, c)
        };
        X.prototype.GetDoubleVariable = function (a, c) {
            var d = this.If;
            I();
            a = a && "object" === typeof a ? a.If : J(a);
            c && "object" === typeof c && (c = c.If);
            return !!ef(d, a, c)
        };
        X.prototype.GetStringVariable = function (a) {
            var c = this.If;
            I();
            a = a && "object" === typeof a ? a.If : J(a);
            return q(ff(c, a))
        };
        X.prototype.Init = function (a, c, d, e) {
            void 0 === d && void 0 !== e && (d = 3);
            var g = this.If;
            I();
            a = a && "object" === typeof a ? a.If : J(a);
            c = c && "object" === typeof c ? c.If : J(c);
            e = e && "object" === typeof e ? e.If : J(e);
            d && "object" === typeof d && (d = d.If);
            return void 0 === d && void 0 !== e ? lf(g, a, c, 3, e) : void 0 === d ? jf(g, a, c) : void 0 === e ? kf(g, a, c, d) : lf(g, a, c, d, e)
        };
        X.prototype.GetInitLanguagesAsString = function () {
            return q(mf(this.If))
        };
        X.prototype.InitForAnalysePage = function () {
            nf(this.If)
        };
        X.prototype.SaveParameters = function () {
            gf(this.If)
        };
        X.prototype.RestoreParameters = function () {
            hf(this.If)
        };
        X.prototype.ReadConfigFile = function (a) {
            var c = this.If;
            I();
            a = a && "object" === typeof a ? a.If : J(a);
            of(c, a)
        };
        X.prototype.ReadDebugConfigFile = function (a) {
            var c = this.If;
            I();
            a = a && "object" === typeof a ? a.If : J(a);
            pf(c, a)
        };
        X.prototype.SetPageSegMode = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            qf(c, a)
        };
        X.prototype.GetPageSegMode = function () {
            return rf(this.If)
        };
        X.prototype.TesseractRect = function (a, c, d, e, g, h, k) {
            var m = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            d && "object" === typeof d && (d = d.If);
            e && "object" === typeof e && (e = e.If);
            g && "object" === typeof g && (g = g.If);
            h && "object" === typeof h && (h = h.If);
            k && "object" === typeof k && (k = k.If);
            return q(sf(m, a, c, d, e, g, h, k))
        };
        X.prototype.ClearAdaptiveClassifier = function () {
            tf(this.If)
        };
        X.prototype.SetImage = function (a, c, d, e, g, h = 1, k = 0) {
            var m = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            d && "object" === typeof d && (d = d.If);
            e && "object" === typeof e && (e = e.If);
            g && "object" === typeof g && (g = g.If);
            void 0 === c || null === c ? uf(m, a, h, k) : vf(m, a, c, d, e, g, h, k)
        };
        X.prototype.SetImageFile = function (a = 1, c = 0) {
            return wf(this.If, a, c)
        };
        X.prototype.SetSourceResolution = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            xf(c, a)
        };
        X.prototype.SetRectangle = function (a, c, d, e) {
            var g = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            d && "object" === typeof d && (d = d.If);
            e && "object" === typeof e && (e = e.If);
            yf(g, a, c, d, e)
        };
        X.prototype.GetThresholdedImage = function () {
            return H(zf(this.If), O)
        };
        X.prototype.WriteImage = function (a) {
            Af(this.If, a)
        };
        X.prototype.GetRegions = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return H(Df(c, a), T)
        };
        X.prototype.GetTextlines = function (a, c, d, e, g) {
            var h = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            d && "object" === typeof d && (d = d.If);
            e && "object" === typeof e && (e = e.If);
            g && "object" === typeof g && (g = g.If);
            return void 0 === d ? H(Ef(h, a, c), T) : void 0 === e ? H(_emscripten_bind_TessBaseAPI_GetTextlines_3(h, a, c, d), T) : void 0 === g ? H(_emscripten_bind_TessBaseAPI_GetTextlines_4(h, a, c, d, e), T) : H(Ff(h, a, c, d, e, g), T)
        };
        X.prototype.GetStrips = function (a, c) {
            var d = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            return H(Gf(d, a, c), T)
        };
        X.prototype.GetWords = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return H(Hf(c, a), T)
        };
        X.prototype.GetConnectedComponents = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return H(If(c, a), T)
        };
        X.prototype.GetComponentImages = function (a, c, d, e, g, h, k) {
            var m = this.If;
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            d && "object" === typeof d && (d = d.If);
            e && "object" === typeof e && (e = e.If);
            g && "object" === typeof g && (g = g.If);
            h && "object" === typeof h && (h = h.If);
            k && "object" === typeof k && (k = k.If);
            return void 0 === g ? H(Jf(m, a, c, d, e), T) : void 0 === h ? H(_emscripten_bind_TessBaseAPI_GetComponentImages_5(m, a, c, d, e, g), T) : void 0 === k ? H(_emscripten_bind_TessBaseAPI_GetComponentImages_6(m, a, c, d, e, g, h), T) : H(Kf(m,
                    a, c, d, e, g, h, k), T)
        };
        X.prototype.GetThresholdedImageScaleFactor = function () {
            return Lf(this.If)
        };
        X.prototype.AnalyseLayout = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return void 0 === a ? H(Mf(c), P) : H(Nf(c, a), P)
        };
        X.prototype.Recognize = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return Of(c, a)
        };
        X.prototype.FindLines = function () {
            return Bf(this.If)
        };
        X.prototype.GetGradient = function () {
            return Cf(this.If)
        };
        X.prototype.ProcessPages = function (a, c, d, e) {
            var g = this.If;
            I();
            a = a && "object" === typeof a ? a.If : J(a);
            c = c && "object" === typeof c ? c.If : J(c);
            d && "object" === typeof d && (d = d.If);
            e && "object" === typeof e && (e = e.If);
            return !!Pf(g, a, c, d, e)
        };
        X.prototype.ProcessPage = function (a, c, d, e, g, h) {
            var k = this.If;
            I();
            a && "object" === typeof a && (a = a.If);
            c && "object" === typeof c && (c = c.If);
            d = d && "object" === typeof d ? d.If : J(d);
            e = e && "object" === typeof e ? e.If : J(e);
            g && "object" === typeof g && (g = g.If);
            h && "object" === typeof h && (h = h.If);
            return !!Qf(k, a, c, d, e, g, h)
        };
        X.prototype.GetIterator = function () {
            return H(Rf(this.If), L)
        };
        X.prototype.GetUTF8Text = function () {
            return q(Sf(this.If))
        };
        X.prototype.GetHOCRText = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return q(Tf(c, a))
        };
        X.prototype.GetTSVText = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return q(Uf(c, a))
        };
        X.prototype.GetBoxText = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return q(Vf(c, a))
        };
        X.prototype.GetUNLVText = function () {
            return q(Wf(this.If))
        };
        X.prototype.GetOsdText = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return q(Xf(c, a))
        };
        X.prototype.MeanTextConf = function () {
            return Yf(this.If)
        };
        X.prototype.AllWordConfidences = function () {
            return H(Zf(this.If), bi)
        };
        X.prototype.AdaptToWordStr = function (a, c) {
            var d = this.If;
            I();
            a && "object" === typeof a && (a = a.If);
            c = c && "object" === typeof c ? c.If : J(c);
            return !!$f(d, a, c)
        };
        X.prototype.Clear = function () {
            ag(this.If)
        };
        X.prototype.End = function () {
            bg(this.If)
        };
        X.prototype.ClearPersistentCache = function () {
            cg(this.If)
        };
        X.prototype.IsValidWord = function (a) {
            var c = this.If;
            I();
            a = a && "object" === typeof a ? a.If : J(a);
            return dg(c, a)
        };
        X.prototype.IsValidCharacter = function (a) {
            var c = this.If;
            I();
            a = a && "object" === typeof a ? a.If : J(a);
            return !!eg(c, a)
        };
        X.prototype.DetectOS = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return !!fg(c, a)
        };
        X.prototype.GetUnichar = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return q(gg(c, a))
        };
        X.prototype.GetDawg = function (a) {
            var c = this.If;
            a && "object" === typeof a && (a = a.If);
            return H(hg(c, a), fi)
        };
        X.prototype.NumDawgs = function () {
            return ig(this.If)
        };
        X.prototype.oem = function () {
            return jg(this.If)
        };
        X.prototype.__destroy__ = function () {
            kg(this.If)
        };
        function Y() {
            this.If = lg();
            Ih(Y)[this.If] = this
        }
        Y.prototype = Object.create(G.prototype);
        Y.prototype.constructor = Y;
        Y.prototype.Nf = Y;
        Y.Of = {};
        b.OSResults = Y;
        Y.prototype.print_scores = function () {
            mg(this.If)
        };
        Y.prototype.get_best_result = Y.prototype.$h = function () {
            return H(ng(this.If), S)
        };
        Object.defineProperty(Y.prototype, "best_result", {
            get: Y.prototype.$h
        });
        Y.prototype.get_unicharset = Y.prototype.pi = function () {
            return H(og(this.If), ai)
        };
        Object.defineProperty(Y.prototype, "unicharset", {
            get: Y.prototype.pi
        });
        Y.prototype.__destroy__ = function () {
            pg(this.If)
        };
        function Z() {
            throw "cannot construct a Pixa, no constructor in IDL";
        }
        Z.prototype = Object.create(G.prototype);
        Z.prototype.constructor = Z;
        Z.prototype.Nf = Z;
        Z.Of = {};
        b.Pixa = Z;
        Z.prototype.get_n = Z.prototype.hg = function () {
            return qg(this.If)
        };
        Object.defineProperty(Z.prototype, "n", {
            get: Z.prototype.hg
        });
        Z.prototype.get_nalloc = Z.prototype.ig = function () {
            return rg(this.If)
        };
        Object.defineProperty(Z.prototype, "nalloc", {
            get: Z.prototype.ig
        });
        Z.prototype.get_refcount = Z.prototype.cg = function () {
            return sg(this.If)
        };
        Object.defineProperty(Z.prototype, "refcount", {
            get: Z.prototype.cg
        });
        Z.prototype.get_pix = Z.prototype.ji = function () {
            return H(tg(this.If), $h)
        };
        Object.defineProperty(Z.prototype, "pix", {
            get: Z.prototype.ji
        });
        Z.prototype.get_boxa = Z.prototype.bi = function () {
            return H(ug(this.If), T)
        };
        Object.defineProperty(Z.prototype, "boxa", {
            get: Z.prototype.bi
        });
        Z.prototype.__destroy__ = function () {
            vg(this.If)
        };
        (function () {
            function a() {
                b.RIL_BLOCK = wg();
                b.RIL_PARA = xg();
                b.RIL_TEXTLINE = yg();
                b.RIL_WORD = zg();
                b.RIL_SYMBOL = Ag();
                b.OEM_TESSERACT_ONLY = Bg();
                b.OEM_LSTM_ONLY = Cg();
                b.OEM_TESSERACT_LSTM_COMBINED = Dg();
                b.OEM_DEFAULT = Eg();
                b.OEM_COUNT = Fg();
                b.WRITING_DIRECTION_LEFT_TO_RIGHT = Gg();
                b.WRITING_DIRECTION_RIGHT_TO_LEFT = Hg();
                b.WRITING_DIRECTION_TOP_TO_BOTTOM = Ig();
                b.PT_UNKNOWN = Jg();
                b.PT_FLOWING_TEXT = Kg();
                b.PT_HEADING_TEXT = Lg();
                b.PT_PULLOUT_TEXT = Mg();
                b.PT_EQUATION = Ng();
                b.PT_INLINE_EQUATION = Og();
                b.PT_TABLE = Pg();
                b.PT_VERTICAL_TEXT =
                    Qg();
                b.PT_CAPTION_TEXT = Rg();
                b.PT_FLOWING_IMAGE = Sg();
                b.PT_HEADING_IMAGE = Tg();
                b.PT_PULLOUT_IMAGE = Ug();
                b.PT_HORZ_LINE = Vg();
                b.PT_VERT_LINE = Wg();
                b.PT_NOISE = Xg();
                b.PT_COUNT = Yg();
                b.DIR_NEUTRAL = Zg();
                b.DIR_LEFT_TO_RIGHT = $g();
                b.DIR_RIGHT_TO_LEFT = ah();
                b.DIR_MIX = bh();
                b.JUSTIFICATION_UNKNOWN = ch();
                b.JUSTIFICATION_LEFT = dh();
                b.JUSTIFICATION_CENTER = eh();
                b.JUSTIFICATION_RIGHT = fh();
                b.TEXTLINE_ORDER_LEFT_TO_RIGHT = gh();
                b.TEXTLINE_ORDER_RIGHT_TO_LEFT = hh();
                b.TEXTLINE_ORDER_TOP_TO_BOTTOM = ih();
                b.ORIENTATION_PAGE_UP = jh();
                b.ORIENTATION_PAGE_RIGHT = kh();
                b.ORIENTATION_PAGE_DOWN = lh();
                b.ORIENTATION_PAGE_LEFT = mh();
                b.PSM_OSD_ONLY = nh();
                b.PSM_AUTO_OSD = oh();
                b.PSM_AUTO_ONLY = ph();
                b.PSM_AUTO = qh();
                b.PSM_SINGLE_COLUMN = rh();
                b.PSM_SINGLE_BLOCK_VERT_TEXT = sh();
                b.PSM_SINGLE_BLOCK = th();
                b.PSM_SINGLE_LINE = uh();
                b.PSM_SINGLE_WORD = vh();
                b.PSM_CIRCLE_WORD = wh();
                b.PSM_SINGLE_CHAR = xh();
                b.PSM_SPARSE_TEXT = yh();
                b.PSM_SPARSE_TEXT_OSD = zh();
                b.PSM_RAW_LINE = Ah();
                b.PSM_COUNT = Bh()
            }
            La ? a() : Ia.unshift(a)
        })();
        Ph.prototype.getValue = function (a) {
            return !!Ya(this.If + NaN * (a || 0))
        };
        bi.prototype.getValue = function (a) {
            return Ya(this.If + 4 * (a || 0), "i32")
        };
        Yh.prototype.getValue = function (a) {
            return Ya(this.If + 4 * (a || 0), "float")
        };
        ei.prototype.getValue = function (a) {
            return Ya(this.If + 8 * (a || 0), "double")
        };
        di.prototype.get = Xh.prototype.get = $h.prototype.get = function (a) {
            return Ya(this.If + 4 * (a || 0), "*")
        };
        function gi() {
            this.og = {}
        }
        gi.prototype.wrap = function (a, c) {
            var d = zb(4);
            Za(d, 0, "i32");
            return this.og[a] = H(d, c)
        };
        gi.prototype.bool = function (a) {
            return this.wrap(a, Ph)
        };
        gi.prototype.i32 = function (a) {
            return this.wrap(a, bi)
        };
        gi.prototype.f32 = function (a) {
            return this.wrap(a, Yh)
        };
        gi.prototype.f64 = function (a) {
            return this.og[a] = H(zb(8), ei)
        };
        gi.prototype.peek = function () {
            var a = {},
            c;
            for (c in this.og)
                a[c] = this.og[c].getValue();
            return a
        };
        gi.prototype.get = function () {
            var a = {},
            c;
            for (c in this.og)
                a[c] = this.og[c].getValue(), Ch(this.og[c].If);
            return a
        };
        L.prototype.getBoundingBox = function (a) {
            var c = new gi;
            this.BoundingBox(a, c.i32("x0"), c.i32("y0"), c.i32("x1"), c.i32("y1"));
            return c.get()
        };
        L.prototype.getBaseline = function (a) {
            var c = new gi;
            a = !!this.Baseline(a, c.i32("x0"), c.i32("y0"), c.i32("x1"), c.i32("y1"));
            c = c.get();
            c.has_baseline = a;
            return c
        };
        L.prototype.getWordFontAttributes = function () {
            var a = new gi,
            c = this.WordFontAttributes(a.bool("is_bold"), a.bool("is_italic"), a.bool("is_underlined"), a.bool("is_monospace"), a.bool("is_serif"), a.bool("is_smallcaps"), a.i32("pointsize"), a.i32("font_id"));
            a = a.get();
            a.font_name = c;
            return a
        };
        b.pointerHelper = gi;

        return TesseractCore.ready
    });
})();
if (typeof exports === 'object' && typeof module === 'object')
    module.exports = TesseractCore;
else if (typeof define === 'function' && define['amd'])
    define([], function () {
        return TesseractCore;
    });
else if (typeof exports === 'object')
    exports["TesseractCore"] = TesseractCore;
