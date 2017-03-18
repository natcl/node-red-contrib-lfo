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

Beware of setting the sampling rate too low as it may hog your CPU.
