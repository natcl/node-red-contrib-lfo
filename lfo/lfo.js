module.exports = function(RED) {
    function LFONode(config) {
        const osc = require('oscillators');
        const clock = require('since-when');
        
        RED.nodes.createNode(this, config);
        var node = this;
        node.lfo = null;

        node.wave = config.waveform;
        node.freq = config.frequency;
        node.samplingrate = config.samplingrate;

        node.on('input', function(msg) {

            if (!isNaN(msg.payload)) {
                node.freq = msg.payload;
                return;
            }

            if (msg.payload === 'stop') {
                if (node.lfo) {
                    clearInterval(node.lfo);
                    node.lfo = null;
                }
                return;
            }

            if (!node.lfo) {
                node.time = new clock();
                node.lfo = setInterval(function() {
                    if (node.wave === 'sine') {
                        node.send({
                            payload: osc.sine(node.time.sinceBeginNS() / 1e9, node.freq)
                        });
                    }
                    if (node.wave === 'saw') {
                        node.send({
                            payload: osc.saw(node.time.sinceBeginNS() / 1e9, node.freq)
                        });
                    }
                    if (node.wave === 'saw_i') {
                        node.send({
                            payload: osc.saw_i(node.time.sinceBeginNS() / 1e9, node.freq)
                        });
                    }
                    if (node.wave === 'triangle') {
                        node.send({
                            payload: osc.triangle(node.time.sinceBeginNS() / 1e9, node.freq)
                        });
                    }
                    if (node.wave === 'square') {
                        node.send({
                            payload: osc.square(node.time.sinceBeginNS() / 1e9, node.freq)
                        });
                    }
                    if (node.wave === 'sig') {
                        node.send({
                            payload: osc.sig(node.time.sinceBeginNS() / 1e9, node.freq)
                        });
                    }

                }, node.samplingrate);
            }
            node.send(msg);
        });

        node.on('close', function() {
            if (node.lfo) {
                clearInterval(node.lfo);
                node.lfo = null;
            }
        });
    }
    RED.nodes.registerType("lfo-node", LFONode);
};
