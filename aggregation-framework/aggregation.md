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



---

### Expressions overview

https://youtu.be/n1-buqH9sUU

[Aggregation Pipeline Quick Reference](https://docs.mongodb.com/manual/meta/aggregation-quick-reference/)

okay so before we go any further I want
to talk a little bit about the use of
expressions in aggregation pipelines if
we take a look at the MongoDB
documentation and review the aggregation
pipeline quick reference we can see an
overview of all of the stages for the
aggregation pipeline as well as a
summary of the various types of
expressions that are available so in
general I want to point you to the
aggregation pipeline quick reference as
your go-to for any questions you have
about the details of any aspect of the
aggregation pipeline what I'd like to do
in this lesson is review the various
types of expressions that are available
so if we scroll down to the expressions
section we have an overview of some of
the different features of expressions
which will dive into in subsequent
lessons but scrolling down we can see
the different classes of expressions
that are supported in the aggregation
framework so there are boolean
expressions that allow us to and or and
not other expressions we have set
expressions allowing us to work with
arrays but treating those arrays as sets
if you're familiar with the concept of a
set from mathematics in particular we
can get the intersection or union of two
or more sets or the difference of two
different sets as well as perform a
number of other set operations there are
also comparison operations these should
be familiar to you comparison operations
allow us to do things like range queries
or in the case of the aggregation
framework range filters there are a
variety of arithmetic expressions many
of which were introduced in MongoDB 32
will touch on a number of these in a
later lesson but you can see that we can
calculate the ceiling the floor natural
log and log as well as simple arithmetic
operations like division and addition
multiplication and subtraction we can
even do things like calculate the square
root of a value there are string
expressions allowing us to do things
like concatenation or taking the
substring and operations having to do
with case text search expressions array
expressions that provide a lot of power
for how we work with arrays including
filtering array elements calculating the
size and slicing an array or just taking
a range of values from a specific array
there are variable expressions which we
won't dive into too deeply and
expressions that allow us to work with
literals date expressions for parsing
date values
and conditional expressions so pretty
cool stuff we can do here finally there
are a whole host of accumulators and
that wraps it up for our quick overview
of the different types of expressions
that are available we will dive into
many of these with a variety of examples
in subsequent lessons and again just a
reminder if you have questions about the
syntax or specific details about
anything having to do with the
aggregation framework I strongly
encourage you to use the aggregation
pipeline quick reference as your
starting point for addressing those
questions


---



### Project introduction to reshaping

https://youtu.be/csy5ERC3ifw

- Promoting nested fields

okay now I'd like to take a deeper dive
into project stages within aggregation
pipelines and what I'd like to look at
is an introduction to reshaping what I'm
going to try to touch on here are the
types of reshaping operations that
should be most common in the
applications that you develop so we've
seen some simple projections in
aggregation pipelines now let's look at
some that are a little bit more complex
these are an example of what I like to
think of as promoting nested fields
let's dive into this example so you can
see what I mean so here we're doing a
match so imagine that you're running a
report or responding to a query to your
website or you have an application that
is fielding a query to your website and
what you're looking for are all
companies where Greylock partners
participated in some round of funding
okay so by participated we simply mean
that Greylock partners invested in the
company so just a quick refresher within
company documents we have a funding
rounds field that has as its value an
array and within that array each element
is a document that summarizes a round of
funding including the raised amount and
the year in which the funding round
occurred there's also an investments
field that investments field lists the
organizations and individuals that
participated in a given round of funding
so going back to our match we're looking
at the funding rounds field the
investments field contained by all
documents in the funding rounds array
and within each element of the
investments array we're going to look
for the permalink value of a financial
org nested document and only retrieve
documents where this permalink field
matches the string Greylock so taking a
look again here's an example we're
matching against elements of the funding
rounds array this is one investments
financial org and finally permalink and
we're looking for Greylock as the value
of this field okay so using dot notation
we have driven down into the financial
org document for each investor now what
we're going to do in terms of output is
for project again we're going to
suppress the underscore ID and include
the name but we're also going to promote
some nested fields here so we're going
to dive into the IPO field and the
funding rounds field and take values
from those nested documents and array
is and make them top level values in the
documents that we produce as output from
this aggregation pipeline let's run this
once so you can see what I mean so
running this each document has a field
for name it also has a field for funders
and for those companies that actually
have gone through an IPO there is an IPO
year and valuation note that in all of
these documents these are top-level
fields and the values are associated
with those top-level fields these are
values that we given our project
statement promoted from nested documents
and arrays this is actually similar to
what you might see in a linux shell like
bash if we specify a dollar inside
quotes then MongoDB interprets this as
give me the value identified by this key
the dollar means give me the value so
we're saying find the IPO nested
document and the pub your value of that
nested document and assign that as the
value for the IPO key in all output
documents we do something very similar
for valuation what we're doing here for
funders is essentially the same thing
it's just that we have to drive a lot
deeper into our document to go all the
way down to the permalink for the
financial org within the investments
array which is a subfield of each
element in the funding rounds array and
pulling out the funders now one thing
you might have noticed is that we're
seeing multiple values print it out for
funders in fact we're seeing an array of
arrays the reason for that is because
for every funding round we're going to
get potentially many investors is that
we know that funding rounds are
represented by an array and we know that
all of the funders are contained within
an array called investments so what's
happening here is the aggregation
framework knows that we want to see the
financial org dot permalink value for
each entry in the investments array for
every funding round but because we're
only specifying that we want to see this
one value rather than print out this
entire document or anything else here
we're simply including this value for
every entry in investments for every
funding round so an array of arrays is
built up but that array of arrays is
composed only of the field values that
we are explicitly projecting out here if
we take a look at an IPO document we're
taking IPO dot pub year an IPO that
value
vation amount and for every docket for
every company that has had an IPO we're
using those values to construct top
level fields and our output documents so
again these are examples of promoting
nested fields in later lessons we'll see
how we can perform arithmetic operations
string operations operations involving
dates and a number of other types of
operations to produce documents
outputted from my project stage of all
shapes and sizes just about the only
thing we can't do from a project stage
relatively speaking is change the data
type for a value we have lots of power
in what type of documents we construct
using a project stage here is where we
begin to see some hints of that a second
example i want to show you in this
lesson is an example of actually
constructing a new document from values
in our input document is constructing a
new nested document from values we
receive in input documents so in this
case what we're going to do is take the
top level values of founded year founded
month and found a day and create a
nested document called founded that has
year month and day fields for every
document that matches our filter so
running this we can see that our
document has the right shape and just to
be completely clear what we're doing
we're taking these values here for
founded year founded month and found a
day and in our output documents are
creating a nested document called
founded essentially aggregating together
those values for the day on which a
company was founded into a single nested
document in our output documents as we
see here and we can actually see that
we're missing some values in order to
get the complete picture so in some ways
this is going the opposite direction of
promoting nested fields we're
essentially creating a nested document
from some top-level fields so again you
have a lot of control a lot of power a
lot of flexibility and how you reshape
documents using a project stage in the
aggregation framework

    > db.companies.aggregate([ {$match: {name: "Facebook"} }, {$project: {_id:0, name:1, people: "$relationships.person.last_name"}} ]).pretty()
    
---



### $unwind

```
{
key1 : "value1",
key2 : "value2",
key3 : ["elem1",
	"elem2",
	"elem3"]
}
```

```
$unwind
{
key1 : "value12,
key2 : "value2",
key3 : "elem1"
}

{
key1 : "value1",
key2 : "value2",
key3 : "elem2"
}

{
key1 : value1,
key2 : value2,
key3 : "elem3"
}
```
Find all greylock and upgrade raised_amount and founded_year

```javascript
db.companies.aggregate([
{ $match: {"funding_rounds.investment.financial_org.permalink": "greylock"}},
{ $unwind: "$funding_rounds" },
{ $project: {
    _id: 0,
    name: 1,
    amount: "$funding_rounds.raised_amount",
    year: "$funding_rounds.funded_year"
} }
]);
```

---

### intro to $group

https://youtu.be/6W8GF4X_euo


**Group companies by founded year and sort by number of employees**

```
db.companies.aggregate([
{ $group: {
    _id:{founded_year: "$founded_year"}, 
    average_number_of_employees: {$avg: "$number_of_employees"} 
} }, 
{$sort: {average_number_of_employees: -1}} ]);
```

**List all companies founded on 2001**

```
db.companies.aggregate([
{ $match : { founded_year : 2001 } },
{ $project : {_id:0, name:1, number_of_employees:1} },
{$sort: {number_of_employees: -1}}
])
```

```
db.companies.aggregate([
{ $match : { "relationships.person" : { $ne : null } } },
{ $project : {_id:0, relationships:1} },
{ $unwind : "$relationships" },
{ $group: {
    _id : "$relationships.person", 
    count: {$sum: 1} 
} },
{$sort: {count: -1}}
])
```

accumulators are historically the
province of the group stage and the
mongodb aggregation framework group is
actually similar to the sequel group by
a command so if you're familiar with
that a lot of the concepts that we're
going to discuss here should be familiar
to you in a group stage we can aggregate
together values from multiple documents
and perform some type of aggregate
operation on them such as calculating an
average let's take a look at an example
here we're going to use a group stage to
aggregate together all companies on the
basis of the year in which they were
founded we're then going to calculate
the average number of employees for each
company so let me run this and then
we'll return to this call and dig in in
a little more detail okay so here we can
see that our output includes documents
that as their underscore ID have a
document with founded year and then the
year in which the company was founded
and then a report on the average number
of employees now this is the type of
thing we might do if we were trying to
get a handle on say unusually good years
to found a company or just in general
we're interested to see what type of
correlation there was between the year
in which a company was founded and its
growth possibly normalizing for how old
the company is so let's return to the
command that we ran and dive in a little
bit more detail as you can see this
aggregation pipeline has two stages a
group stage and a sort stage now
fundamental to the group stage is the
underscore ID field that we specify as
part of the document that is the value
of the dollar group operator itself
using a very strict interpretation of
the aggregation framework syntax
underscore ID is how we define how we
control how we tune what the group stage
uses to organize the documents that it
sees now since the group stage is first
the aggregate command will pass all
documents in the company's collection
through this stage and the stage will
take every document that has the same
value for founded year and treat them as
a single group so in constructing the
value for this field this expression
using the average accumulator
we'll calculate an average of number of
employees for all documents with the
same founded year you can think of it
this way each time the group stage
encounters a document with a specific
founded year it adds it to a running sum
of number of employees and account for
number of documents seen so far and then
once all documents have passed through
the group stage it can then calculate
the average using that running some and
count for every grouping of documents it
identified based on the founded year
finally here we have a sort stage that's
simply sorts in reverse order because
we're using negative one here based on
average number of employees from the
documents it is passed from the group
stage average number of employees being
the value that we calculated here using
this average expression so running this
again and then iterating through
represented by each one of these
documents is a calculation based on
every company that has a founded year
matching each of these values and as we
iterate through we see that in fact
because we've sorted in descending order
most of the founding years we're seeing
here initially are from quite some time
ago or from old companies oh look at
that so there is actually one from 2001
which seems a little bit out of place
given the company it's keeping here with
a fairly high average number of
employees especially in comparison to
other companies founded much earlier so
one thing we might do in running a
report like this is actually dive in a
little bit deeper see what's going on
with the year 2001 so we can run a
simple aggregation query matching on
2001 and what we're going to do here is
simply project out the number of
employees for every single company
there's no grouping or anything going on
here I just like to have a view into
what companies were talking about in
2001 okay so this is why we're seeing
such a high average because Accenture
was founded in that year and meta carta
and both of them have very large numbers
of employees skewing average a little
higher than it would be for say other
years close to that we can see that if
we do a similar search in the year 2000
just 18,000 as the highest number of
employees and you can imagine what
employee numbers for companies founded
in other years in the 2000s must look
like so we've seen one example of an
accumulator
that being a group stage using the
average accumulator let's take a look at
one other now imagine what you'd like to
see our people who've been associated
with a large number of companies if
you'll remember our company's documents
contain a field for relationships that
gives us the ability to dive in and look
at people who have in one way or another
been associated with a relatively large
number of companies now let's take a
look at this aggregation query in some
detail first we're matching on
relationships person and if we quickly
hop over and take a look at our Facebook
example document we can see how
relationships are structured with in
this document and get a sense for what
it means to do this essentially we're
saying I want to take a look at all
relationships that are not null in fact
to be more precise here what I should
really do is change this query so that
I'm actually comparing relationships
that person to null so I want to see all
documents where relationship that person
is not null okay then here what I'm
going to do is project out all
relationships for documents that match
so I'm just going to take a look at
relationships for the rest of this
pipeline then we're going to unwind
relationships so that every relationship
in the relationships array comes through
to the next stage that being a group
stage as a separate document and then
finally what i'm doing here is using the
person so this entire document as my
underscore ID value on which to group so
every match to a document for a first
name last name and permalink for a
person will be aggregated together and
in this case rather than using the
average accumulator i'm going to use the
sum accumulator and then finally sort
into descending order before we run this
though talk about a couple of things
that are different from the examples
we've seen so far first we're using the
sum accumulator and we haven't seen that
used yet and here also we're
constructing our ID using an expression
that's different from the last example
in another lesson we go into some detail
about IDs and how you should think about
them in group stages so let's run this
and in fact let's make it pretty ok and
if we scroll up to the first result we
can see that tim hanlon is the
individual in this collection that has
been associated with the most companies
28
to be exact okay so returning to our
query how do we know that well we don't
in fact what we know is that tim hanlon
appeared in 28 documents that were
passed to this group stage but what
documents were passed through this group
stage well they were all of the
relationships for all companies in our
collection so as you'll note from again
our example document there's a title
associated with each person and in fact
in his past field that tells us whether
or not this person at the time this
database was last updated still had that
title it's entirely possible that
individuals in these eighteen thousand
documents here would appear more than
once in the relationships for a single
company as they change titles I use this
example to illustrate a very important
point about aggregation pipelines make
sure you fully understand what it is
you're working with as you do
calculations particularly when you're
calculating aggregate values using
accumulator expressions of some kind in
this case what we can say is that tim
hanlon appears 28 times in relationship
documents throughout the companies in
our collection we would have to dig a
little deeper to see exactly how many
unique companies he was in fact
associated with and we'll leave that
calculation as an exercise to you