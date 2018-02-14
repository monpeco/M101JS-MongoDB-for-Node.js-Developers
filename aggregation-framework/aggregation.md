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


---

### Aggregation starting with familiar operations

https://youtu.be/Kxegt-5iT-Q

as our first steps in developing
aggregation pipelines what I'd like to
do is take a look at building some
pipelines that involve operations that
are already familiar to you so we're
going to look at the match project sort
skip and limit stages the match stage is
a filtering stage very similar to find
in fact the query syntax for match is
exactly the same as what we have for
find you're already familiar with
projections we'll look at building
project stages in the aggregation
framework will also look at doing sorts
skips and limits using those respective
stages in the framework we're starting
here to get a good sense for how to
build aggregation pipelines you might
ask yourself why these stages are
necessary given that this functionality
is already provided in the mongo DB
query language and the reason is because
we need these stages to support the more
complex analytics oriented functionality
that's included with the aggregation
framework and in fact for project will
very quickly see the additional power
that the aggregation pipeline provides
for doing projections functionality that
goes well beyond simply including or
excluding fields as we've seen so far so
let's get started building some
pipelines now to work through these
aggregation examples we're going to
return to the crunch based data set
looking at the company's found within
this data set as a quick refresher will
look once again at the Facebook example
we've looked at previously remember that
in this data set we have a number of
fields that specify details on companies
such as number of employees the year in
which a company was founded as well as
the month and day there are also fields
for the rounds of funding a company has
gone through as well as a number of
other details such as milestones for the
company as well as whether or not a
company's been through an IPO and if so
what were the details on that initial
public offering so returning to our
example we're going to do a very simple
filter simply looking for all companies
where the founded year was 2004 again
this is the same type of thing that we
could do with the find query we're using
this merely as an example to get you
comfortable with building aggregation
pipelines so if we run this we can see
that we get a bunch of output and we
could do something like this to make it
a little bit easier to read but we can
also add
second stage to our pipeline that will
improve things substantially so here
we're going to introduce a project stage
to this aggregation pipeline and we're
going to exclude the underscore ID
include the name and the founded year
and now we can see output that's much
more readable and iterate through all
the documents matching our filter so
let's unpack this aggregation pipeline
in a little bit more detail the first
thing I'd like you to notice is that
we're using the aggregate method this is
the method we call when we want to run
an aggregation query and to aggregate we
pass an aggregation pipeline so what's a
pipeline well a pipeline is an array
with documents as elements and each of
the documents must stipulate a
particular stage operator so in this
case we have an aggregation pipeline
that has two stages we have a stage four
match and a stage for project match is
simply filtering documents in our
company's collection to only pull those
that have a founded year of 2004 and
project is simply giving us a couple of
fields rather than all of the fields for
the documents matching this filter so
what's happening here is that match is
filtering against this collection and
passing on to the project stage one at a
time all of the documents that match
this filter project then is performing
its operation in reshaping the document
in this case simply including and
excluding specific fields and then
passes that output to us since we're
working in the shell we see the output
displayed right here if we were working
in an application we would get a cursor
to this output that we could then
iterate through so now let's extend our
pipeline a bit and we'll take a look at
the limit aggregation stage so in this
case we're still going to match using
the same query but limit our results set
to five and project out in this case
just the name we've already demonstrated
to ourselves that our filter is working
correctly so I'm going to go ahead and
drop the founded gear from the
projection and we can see that we do in
fact just have five documents there's no
cursor here that we can iterate through
just have five and note that what i'm
doing here is i'm actually limiting
before i run my projection so you might
ask yourself what happens if we do
things in reverse order so what if i
were to do something like this instead
well we get exactly the same result
the difference is that we ran hundreds
of documents through the project stage
before finally limiting to five so
regardless of what type of optimizations
the mongo DB query planner might be
capable of I pause here to encourage you
to always be thinking about the
efficiency of your aggregation pipeline
and trying to make sure that you are
limiting the number of documents that
need to be passed on to the next stage
only considering those documents that
are absolutely necessary from one stage
to another this requires a careful
consideration of the entire flow of
documents through a pipeline because it
may in fact be the case we couldn't
actually do this quite yet in this case
we really are only interested in the
first five documents that match our
query so it's perfectly fine to limit as
our second stage rather than our third
as we did originally so next let's take
a look at a sort stage so here before we
run our limit we're going to sort based
on the name now start works in a manner
similar to what we've seen already
except in the aggregation framework we
specify sort as a stage with in a
pipeline using the dollar sort operator
as the value for dollar sort we are
simply going to specify the way in which
we'd like to sort in this case by name
in a sending order so now let's think
through our pipeline we're going to
match all documents were founded years
two thousand four from the company's
collection those documents will all be
passed to the sort stage will sort the
documents limit the documents to the
first five and finally pass on those
first five documents to project so here
we are got our output note that we're
looking at a different set of companies
than we were originally and that's
entirely because we're now doing this
sort getting instead the first five
documents in alpha numeric order by name
now I want to encourage you to take care
once again with the order in which you
specify stages in an aggregation
pipeline because MongoDB will execute
the stages in the order you specify so
if rather than doing my sort first I do
my limit first what I end up with is the
first five documents to match the query
sorted into alpha numeric order so these
same five documents that I saw before
when I was simply doing a limit but now
rather than dig being first add this is
first and all of the documents are in
fact in alphabetical order
so be careful about the order in which
you specify sort skip and limit in
aggregation pipelines make sure it's the
order you intend so finally to close out
this lesson let's take a look at
including a skip stage so here going to
sort first I'm going to skip the first
10 and then again limit by 5 and now I
see documents that look like they were
in fact sorted from the beginning of the
collection not the ones I saw earlier
because we've skipped the first ten so
let's review our pipeline one more time
we've got one two three four five stages
we're first filtering the company's
collection looking only for documents
where the founded year is 2004 were then
sorting based on the name into a sending
order skipping the first 10 and then
limiting our and results 25 and finally
passing those five documents on to
project where we're just going to print
out the name such that our output
documents have just one field the field
for name so in this lesson we looked at
how to construct aggregation pipelines
and did so using some operations that
we're already familiar with again these
operations are provided in the framework
because they're necessary for the types
of analytics tasks that we want to
accomplish using other operations we've
not yet seen as we move through the rest
of the lessons in the aggregation
section we'll take a deep dive on the
other types of operations that the
aggregation framework provides and we'll
take a deeper dive in fact on project to
look at the variety of options that are
available to us with respect to
projection within an aggregation
framework operations that allow us to
perform arithmetic do string
concatenation work with dates etc
