### Introduction to the Aggregation Framework

https://youtu.be/p5bFDy94cnA

all right welcome to our discussion of
MongoDB segregation framework the
aggregation framework is a set of
analytics tools within MongoDB that
allow you to run various types of
reports or analysis on documents in one
or more MongoDB collections the
aggregation framework is based on the
concept of a pipeline the idea with an
aggregation pipeline is that we take
input from a MongoDB collection and pass
the documents from that collection
through one or more stages each of which
performs a different operation on its
inputs now each stage takes as input
whatever the stage before it produced as
output and the inputs and outputs for
all stages are documents a stream of
documents if you will now if you're
familiar with pipelines in a linux shell
such as bash this is a very similar idea
each stage has a specific job that it
does it's expecting a specific form of
document and produces a specific output
which is itself a stream of documents at
the end of the pipeline we get access to
the output much in the same way that we
would by executing a find query and by
that I simply mean we get a stream of
documents back that we can then do
additional work with whether it's
creating a report of some kind
generating the website or some other
type of task now let's dive in a little
bit deeper and consider individual
stages so an individual stage of an
aggregation pipeline is a data
processing unit as I mentioned that
stage takes a stream of input documents
one at a time processes each document
one at a time and produces an output
stream of documents again one at a time
each stage provides a set of knobs or
tunable that we can control to
parameterize the stage to perform
whatever task were interested in doing
so a stage performs a generic task a
general purpose task of some kind and we
parameterize the stage for the
particular set of documents that we're
working with and exactly what we would
like that stage to do with those
documents these tunable is typically
take the form of operators that we can
supply that will modify fields perform
arithmetic operations reshape documents
or do some sort of accumulation tasks as
well as a variety of other things so
finally the last thing I'd like to
mention about aggregation pipelines is
that it's frequently the case that we'll
want to include the same type of stage
multiple times within a single pipeline
for example we may want to perform an
initial filter so that we don't have to
pass the entire collection into our
pipeline but then later on following
some additional processing want to
filter once again using a different set
of criteria
so to recap pipelines work with a
MongoDB collection they're composed of
stages each of which does a different
data processing task on its input and
produces documents as output to be
passed to the next stage and finally at
the end of the pipeline output is
produced that we can then do something
within our application in many cases
it's necessary to include the same type
of stage multiple times within an
individual pipeline in subsequent
lessons we will look in detail at the
various pipeline stages what they do and
how to prioritize them we'll also look
at a number of different examples of
building aggregation pipelines


