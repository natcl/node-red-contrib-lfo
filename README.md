# node-red-contrib-lfo

Low frequency oscillators for Node-RED.

Will output numbers between -1 and 1 at the given frequency according to the selected waveform.

Sending a number as `msg.payload` will change the frequency of the LFO. Sending the string `'stop'` as `msg.payload` will stop the output. Sending anything else will start the waveform. The waveform can also be changed dynamically by changing `msg.waveform` valid choices are:

- sine
- saw
- saw_i
- triangle
- square
- sig

Beware of setting the sampling rate too low as it may hog your CPU.  To avoid CPU hogging, chunked output can be activated: when chunk size is set to N, then only every N-th sample an output message will be send (containing an array of N samples).

An example flow is available via the Node-RED flow editor menu: Import / Examples / Lfo
