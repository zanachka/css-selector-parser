import {createParser, ast} from './import.js';

describe('CSS Modules', () => {
    describe('css-position-1', () => {
        it('should parse position-1 pseudo-classes when module is enabled', () => {
            const parse = createParser({
                modules: ['css-position-1']
            });
            
            expect(parse(':static')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'static'})]
                        })
                    ]
                })
            );
            
            expect(parse(':relative')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'relative'})]
                        })
                    ]
                })
            );
            
            expect(parse(':absolute')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'absolute'})]
                        })
                    ]
                })
            );
            
            // Should reject fixed as it's not in position-1
            const strictParse = createParser({
                modules: ['css-position-1'],
                syntax: {
                    pseudoClasses: {
                        unknown: 'reject'
                    }
                }
            });
            
            expect(() => strictParse(':fixed')).toThrow('Unknown pseudo-class: "fixed".');
        });
    });
    
    describe('css-position-2', () => {
        it('should parse position-2 pseudo-classes when module is enabled', () => {
            const parse = createParser({
                modules: ['css-position-2']
            });
            
            // Position-2 adds fixed
            expect(parse(':fixed')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'fixed'})]
                        })
                    ]
                })
            );
            
            // Should reject sticky as it's not in position-2
            const strictParse = createParser({
                modules: ['css-position-2'],
                syntax: {
                    pseudoClasses: {
                        unknown: 'reject'
                    }
                }
            });
            
            expect(() => strictParse(':sticky')).toThrow('Unknown pseudo-class: "sticky".');
        });
    });
    
    describe('css-position-3', () => {
        it('should parse position pseudo-classes when module is enabled', () => {
            const parse = createParser({
                modules: ['css-position-3']
            });

            expect(parse(':sticky')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'sticky'})]
                        })
                    ]
                })
            );

            expect(parse(':fixed')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'fixed'})]
                        })
                    ]
                })
            );

            expect(parse(':absolute')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'absolute'})]
                        })
                    ]
                })
            );
        });

        it('should reject position pseudo-classes when module is not enabled', () => {
            const parse = createParser({
                syntax: {
                    pseudoClasses: {
                        unknown: 'reject'
                    }
                }
            });

            expect(() => parse(':sticky')).toThrow('Unknown pseudo-class: "sticky".');
            expect(() => parse(':fixed')).toThrow('Unknown pseudo-class: "fixed".');
            expect(() => parse(':absolute')).toThrow('Unknown pseudo-class: "absolute".');
        });
    });

    describe('css-position-4', () => {
        it('should parse position-4 specific pseudo-classes', () => {
            const parse = createParser({
                modules: ['css-position-4']
            });

            expect(parse(':initial')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'initial'})]
                        })
                    ]
                })
            );
        });
    });

    describe('css-scoping-1', () => {
        it('should parse host and host-context pseudo-classes', () => {
            const parse = createParser({
                modules: ['css-scoping-1']
            });

            expect(parse(':host')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'host'})]
                        })
                    ]
                })
            );

            expect(parse(':host(.special)')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [
                                ast.pseudoClass({
                                    name: 'host',
                                    argument: ast.selector({
                                        rules: [
                                            ast.rule({
                                                items: [ast.className({name: 'special'})]
                                            })
                                        ]
                                    })
                                })
                            ]
                        })
                    ]
                })
            );

            expect(parse(':host-context(body.dark-theme)')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [
                                ast.pseudoClass({
                                    name: 'host-context',
                                    argument: ast.selector({
                                        rules: [
                                            ast.rule({
                                                items: [
                                                    ast.tagName({name: 'body'}),
                                                    ast.className({name: 'dark-theme'})
                                                ]
                                            })
                                        ]
                                    })
                                })
                            ]
                        })
                    ]
                })
            );
        });

        it('should parse ::slotted pseudo-element', () => {
            const parse = createParser({
                modules: ['css-scoping-1']
            });

            expect(parse('::slotted(span)')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [
                                ast.pseudoElement({
                                    name: 'slotted',
                                    argument: ast.selector({
                                        rules: [
                                            ast.rule({
                                                items: [ast.tagName({name: 'span'})]
                                            })
                                        ]
                                    })
                                })
                            ]
                        })
                    ]
                })
            );
        });

        it('should reject scoping selectors when feature is not enabled', () => {
            const parse = createParser({
                syntax: {
                    pseudoClasses: {
                        unknown: 'reject'
                    },
                    pseudoElements: {
                        unknown: 'reject'
                    }
                }
            });

            expect(() => parse(':host')).toThrow('Unknown pseudo-class: "host".');
            expect(() => parse(':host-context(body)')).toThrow('Unknown pseudo-class: "host-context".');
            expect(() => parse('::slotted(span)')).toThrow('Unknown pseudo-element "slotted".');
        });
    });

    describe('Multiple modules', () => {
        it('should support multiple modules at once', () => {
            const parse = createParser({
                modules: ['css-position-3', 'css-scoping-1']
            });

            // Position pseudo-class
            expect(parse(':sticky')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'sticky'})]
                        })
                    ]
                })
            );

            // Scoping pseudo-class
            expect(parse(':host')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [ast.pseudoClass({name: 'host'})]
                        })
                    ]
                })
            );

            // Scoping pseudo-element
            expect(parse('::slotted(span)')).toEqual(
                ast.selector({
                    rules: [
                        ast.rule({
                            items: [
                                ast.pseudoElement({
                                    name: 'slotted',
                                    argument: ast.selector({
                                        rules: [
                                            ast.rule({
                                                items: [ast.tagName({name: 'span'})]
                                            })
                                        ]
                                    })
                                })
                            ]
                        })
                    ]
                })
            );
        });
    });
});
