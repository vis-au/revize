# ReModel

ReModel is a library for in-situ modifications in visualization toolchaining that serves as a platform for web-based visualization tools.

In-Situ modification allows authors of visualizations to make edits to an existing visualization pipeline model through its description in a declarative visualization grammar.
At the same time, as the visualization creation process usually involves multiple different tools, using a common exchange format has other benefits.
It allows for example to involve new visualization tools in the process, since any tool supporting the exchange format is a compatible candidate.
Since the visualization description captures its full pipeline model, going back to a tool that was used earlier in the process no longer requires redoing the work that was done in tools that came afterwards, as each tool edits the particular parts of this model.

ReModel provides the functional platform for visualization toolchaining through a simple interface for reading and writing Vega-Lite specifications to a model for composite visualizations.