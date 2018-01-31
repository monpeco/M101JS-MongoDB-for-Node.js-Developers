### MongoDB Schema Design


https://youtu.be/AABYJM12qF4

* Support rich documents
* Pre-join the data - Embedding documents
* No joins
* No constrains
* Atomic operations
* No declared Schema

okay welcome back this week we're going
to talk about Mongo DB schema design if
you're coming from the world of
relational databases you know that there
is a best ideal way to design your
schema which is to keep it in the third
normal form now you can keep data in the
third normal form in MongoDB and we'll
talk a little bit about the third normal
form in the next lesson but in Mongo it
turns out that it's more important to
keep the data in a way that's conducive
to the applications using the data so
you think about your application data
patterns you think about what pieces of
data are used together what pieces of
data are used mostly read-only what
pieces of data are written all the time
and then we're going to organize our
data within MongoDB
to specifically suit the application
data access patterns and that's a bit
different from the world of relational
where instead you try to keep the data
in a way that's agnostic to the
application all right so let's go over
some of the basic facts about MongoDB
just to remind you of them as we talk
about schema design the first is that
MongoDB supports rich documents and by
rich documents I mean that it's not just
tabular data in MongoDB you can store an
array of items or a value for a certain
key can be an entire another document
and this is going to allow us to pre
join data for fast access and that's
important because as you know MongoDB
doesn't support joins directly inside
the kernel instead if you wanted you to
join you're gonna have to join in the
application itself and of course the
reason we do this is because that joins
are very hard to scale and we want the
system to be high performance so as a
result of this you need to think ahead
of time about what data you want to use
together with other data and if it's
possible you might want to embed it
directly within a document and we'll
talk about how you how you do that
the next is that there are no
constraints now if you come from the
world of relational you might remember
that you can have a foreign key
constraint and asked that a at rabida of
one row in a table would form a foreign
key into another table and we don't have
that in MongoDB but it's gonna turn out
it's not as important as you might think
because of embedding embedding is going
to make that a little less important
than what
wize be alright we're gonna think about
atomic operations we don't support
transactions but we do support atomic
operations within MongoDB and within one
document so we're gonna think about how
to organize our data to support atomic
operations if we need them within our
application and the final thing is that
there is no declared schema or within
MongoDB but there's a pretty good chance
that your application is going to have a
schema and by have a schema I mean that
every single document in a particular
collection is probably going to have a
pretty similar structure and there might
be some small changes to that structure
depending on different versions of your
application but mostly each document in
the collection is gonna have a similar
structure and even though it's not
declared ahead of time it's important to
think about that structure so that the
data scheme itself supports all the
different features of your application
alright so let's have a first quiz the
first quiz for schema design is what's
the single most important factor in
designing your application schema within
MongoDB is it making the design
extensible making it easy to read by a
human matching the data access patterns
of your application or keeping the data
in third normal form and and just check
one of those


---

### m101 3 relational normalization

https://youtu.be/GX__f2s4hd8

#### Goals of normalization

* Free database of modification anomalies
* Minimize the redesign when extending
* Avoid bias toward any particular access pattern



Let's start out by reviewing what we try to strive for in
the relational world in the third normal form.
Because I think it'll motivate a lot of the trade offs that
we talk about in the mongoDB world.
This a bit of a review for people who come from the
relational world.
Let's look at a potential schema for a posts table for
the blog project that we've been talking.
And this isn't the whole thing, this is just the posts
itself plus the authors.
So let's say that you had a posts table and you decided to
have a post ID, and a title, and the body, so these are the
different titles of these posts, like Elvis lives, and
the body says, yes he does.
And the author of the post here, Andrew.
And then the author email andrew at 10gen.com The second
post in the table says, mongo rocks.
And it was written by Richard.
And has his email, richard at 10gen.com.
And the third one has the title, hello world.
And it was written by Andrew.
And it has the email andrew at 10gen.com.
So this is a denormalized table structure in the
relational world.
It's not the third normal form.
It's broken.
And it's broken very clearly because you can see right here
that if I want to update my email, let's say the email for
Andrew, I would have to update it here and also here.
And there's a possibility of leaving it inconsistent.
I could update it in this row, but not update it in this row,
and therefore, leave it inconsistent.
And you can pretty much see that this violates
normalization because it violates a common way of
describing normalized tables in the third normal form,
which is that every non-key attribute in the table must
provide a fact about the key, the whole key, and
nothing but the key.
And that's of a play on words for what you say in a US
courtroom, telling the truth, the whole truth, and nothing
but the truth.
And, in particular, the key in this is the post.
This is going to be the primary key for this table.
And there is the attribute, this non-key attribute, author
email, which does not follow that.
Because it does, in fact, tell something about the author.
And so it violates that third normal form.
And, if you remember, from the world of relational having a
database table in the third normal form there's several
good things about that.
And I'll show you what they are.
All right, so what are the goals of normalization in the
relational world?
Well, there's three goals.
One is that it frees the database of these modification
anomalies, like, for instance, the one I just showed you,
where I could update my email address in one row, but not
update it in another, and therefore, leave it
inconsistent within the database.
And the next is it's supposed to minimize the redesign when
extending the database.
Now this, I think, it's a little bit controversial
whether that does that or not.
But that's the idea of normalization.
And the final reason that you normalize these tables, in a
relational world, is this one, is to avoid any bias toward a
particular access pattern.
Now, when we look at building systems within mongoDB, and we
look at the schema that we design in mongoDB, this is the
one that we're not going to worry about.
And the reason is that when you're not biased toward any
particular access pattern, you're equally
bad at all of them.
And one of the ideas behind mongoDB is to tune up your
database to the applications that you're trying to write
and the problem that you're trying to solve.
And so, we're not going to worry about avoiding the bias
toward any particular access pattern.
Now, we are going to worry about this.
We don't want to have to redesign the whole system
every time we change something.
And mongoDB is very flexible that way because we can add
keys and attributes to documents without changing
every existing document.
And then, the last one is freeing the database of these
modification anomalies.
and, although you might think that embedding the data would
cause these, it doesn't have to.
And, in fact, we're mostly going to avoid embedding data
in documents in mongoDB In ways that
create these anomalies.
So we're going to be careful not to create them
for the most part.
Occasionally, for performance reasons, we're going to decide
that we do want to duplicate the data within the document.
But that's not going to be the default.
The default is that we're going to avoid it, so that we
don't have these types of anomalies where data can be
inconsistently changed.
And in some applications, you might want to allow it and it
doesn't matter.
Or you might want to keep it up-to-date in the application,
but mostly we're going to avoid it.

---

### MongoDB Model for Blog

https://youtu.be/lkucDar6I3E

```
Post
{
    _id : "   ",
    Title : "     ",
    Author : "     ",
    Content : "    ",
    Comments : { [ {Author : " " , Content : " " , Date : " "} , {} , {}] } ,   
    Tags : ["MongoDB" , "Awsome"]
}


Author
{
    _id : "   ",
    Name : "     ",
    Email : "     ",
    Password : "    "
}

```

so we saw how we modeled our blog in a
relational system so let's talk about
how we would model this in MongoDB
hopefully you'll find that it's much
simpler first we still need collections
so we still need places to put things so
we would first probably have our posts
collection here and that document would
look a little bit like this so we have
our underscore ID field which has you
know some value in it and then we'd have
the title of this we might have our
author here and that could be his
username or as email or kind of whatever
we're looking or we could store both
author and user name and anomalies a
little bit we'd have the content of this
thing comments we can just kind of put
right in line here so comments could be
an array and so let's do one comment
here where we maybe have the author of
that comment in here as well as the
content of it and maybe the date so
that's one comment but we could put a
couple more back here and so we can
store the comments in line directly we
can do the same thing with tags although
in tags are just kind of strings so
MongoDB and will store awesome as well
so tags and then maybe a date down here
so at the end of the day we've got posts
and comments are embedded directly in
line it's very natural and it's a good
way of doing it we call that embedding
so embedding documents embedding arrays
tags is here so no separate table or
anything for that so all we really left
then is we kind of need an author's
collection as well and that would look
very similar it's mostly flat so we
would have an underscore ID there and
the author's name maybe email again the
password which is again hashed and not
in plain text

One document is all that is needed.

That's not to say that you couldn't break it up into multiple documents, or that there are no advantages in doing so in some circumstances, but there will also be disadvantages; we'll be talking about this more in other lessons on schema design and data modeling. But only one document is needed.


---

### m101 7 living wo constraints

https://youtu.be/YFRMkDPaams

One thing I think about a lot with mongoDB, because I come
from the world of relational before I started working at
10Gen and thinking a lot about the advantages of mongoDB, is
that there are a lot of great things about relational.
And one of the great things about relational is that it's
really good at keeping your data
consistent within the database.
And one of the ways it does that is with foreign key
constraints.
So what is a foreign key constraint?
Well, a foreign key constraint is that let's say these are
actually more like tables, but these are collections in the
case that we showed, what guarantee is it that when you
insert a document into the comments collection, that this
post ID will actually appear in this post collection.
That's a foreign key constraint.
And the answer in mongoDB is there's no guarantee.
It's really up to you as the programmer to make sure that
your data is consistent in that manner.
And that when you store something in a collection, if
you mean for this to be an index into the post collection
that you guarantee that.
Because the database won't guarantee that for you.
And maybe in a future version of mongoDB, we will guarantee
it, but we don't offer a way to do that today.
Same thing with this.
And so, how do you live in a world without these foreign
key constraints without constraints and keep your data
intact and consistent?
And the answer is that embedding actually helps.
And that's why this alternative design that I
showed isn't a particularly good one.
So let's look at the particular case we just talked
about, which is that we had this comments collection and
it had a post ID that we could not guarantee was in the post
collection.
Notice, when we embedded the data, we've solved this
problem entirely.
Because now, since the data appears directly inside the
document, like the comment appeared directly inside the
document, there's no way for me to insert something where
the comment's post ID isn't in the post collection.
That information is already tied together when you
pre-join this data.
Same thing with the tags.
There's no way that we can accidentally store a tag into
the tag collection where the post ID isn't in the post
collection because I've already pre-joined the data
and it's in here.
And so, what I just wanted to point out is that you should
pre-join the data.
You should embed the data in ways that make sense for your
application for lots of different reasons.
And one of them is, it makes it a lot easier to keep the
data intact and consistent.
All right, so time for a quick quiz.
And the quiz is, what does living without
constraints refer to?
And the answers are, living every day like it's your last,
saying whatever you want when you want to, keeping your data
consistent even though mongoDB lacks foreign key constraints,
or wearing no belt.

---

### m101 9 living wo transactions

https://youtu.be/FfRr3qjRfww

#### Atomic operations

* Restruture (into a singel document)
* Implement in Software (Semaphore, ...)
* Tolerate a little inconsistency
 

lack of transactions support within MongoDB.
And from the relational world a lot of you know that
transactions offer atomicity, consistency, isolation, and
durability.
But, although we don't have transactions within MongoDB,
we do have atomic operations.
So what does that mean?
Well, atomic operations mean that when you work on a single
document that that work will be completed before anyone
else sees the document.
They'll either see all the changes that you
make or none of them.
And using atomic operations, you can often accomplish the
same thing you would have accomplished using
transactions in a relational database.
And the reason is, that in a relational database, you need
to make changes across multiple tables, usually
tables that need to be joined, and so you want to
do that all at once.
And to do it, since there are multiple tables, you'll have
to begin a transaction and do all those updates and then end
the transaction.
But with MongoDB, since you're going to embed the data, since
you're going to pre-join it in documents--
and they're these rich documents that have
hierarchy--
you often cam accomplish the same thing.
For instance, in the blog example, if you wanted to make
sure that you updated a blog post atomically, you can do
that because you can update the entire blog post at once.
Whereas, if it was a bunch of relational tables, you'd
probably have to open a transaction so that you can
update the post collection and the comments collection.
So what are your approaches that you can take in MongoDB
to overcome a lack of transactions?
And the answer is there are really three different
approaches.
And I want to go over them real quickly.
The first is that you can restructure your code so that
you're working within a single document and taking advantage
of the atomic operations that we offer within that document.
And if you do that, then usually you're all set.
And you won't miss the transactions at all.
The second thing you can do, if you'd like, is you can
essentially implement some sort of locking in software.
You can do this by creating a critical section.
You can essentially build a test, test, and set using find
and modify.
You can build semaphores if you want to.
And, in a way, this is the way the larger world works anyway.
If you think about it, if one bank needs to transfer money
to another bank, they're not living in the
same relational system.
And they each have their own relational databases often.
And they have to be able to coordinate that operation,
even though you can't begin transaction and end
transaction across those database systems, only within
one system within one bank.
So there's certainly ways in software to
get around the problem.
And the final approach, which often works in modern web
applications and other applications that take in a
tremendous amount of data, is to just tolerate a little bit
of inconsistency.
An example would be if you're talking about a friend feed in
Facebook, it doesn't matter if everybody sees your wall
update simultaneously.
It's OK if one person's a few beats
behind for a few seconds.
And then they catch up.
It often isn't critical in a lot of system designs that
everything be kept perfectly consistent and that everyone
have a perfectly consistent and the
same view of the database.
So you could simply tolerate a little bit of inconsistency
that's somewhat temporary.
So those are three approaches.
You can restructure to make sure that everything happens
within a single document so that you get the advantages of
atomic operations.
You can implement whatever you're
looking for in software.
Or you can tolerate a little bit of a consistency that you
might get without transactions.
All right, so, let's do a quiz.
So here's the quiz.
Which of the following operations operate atomically
within a single document in MongoDB?
Check all that apply.
And the choices are, the update command, the find and
modify command, the add to set command within an update, or
the push, again within an update.
And if you remember add to set, add something to an array
list, if it's not there, push, push, is at
the end of the list.


---

### m101 11 one to one

https://youtu.be/cCsfon0vUlQ

```
# 1

Employee
{
	_id : 20,
	name : "Andrew"
}

Resume
{
	_id : 20,
	jobs: [   ],
	education : [   ]
}


```

Reason to embeed o keep one-to-one
* Frecuency of Access
* Size of Items
* Atomicity of documents

Let's talk about 1 to 1 relations.
1 to 1 relations are relations where each item corresponds to
exactly one other item.
So, for example, an employee has a resume.
There is one employee has one resume.
One resume has one employee.
A building has a floor plan.
A floor plan has a building.
A patient has a medical history, and the medical
history corresponds to the patient.
Let's look at this first case, the employee-resume example.
We can model this in several different ways
to talk about that.
All right.
So we can model the employee-resume relation by
having a collection of employees and a collection of
resumes and having the employee point to the resume
through linking, where we have an ID that corresponds to an
ID in the resume collection.
Or if we prefer, we can link in the other direction, where
we have an employee key inside the resume collection, and it
may point to the employee itself.
Or if we want, we could embed.
So, we could take this entire resume document, and we could
embed it right here inside the employee document.
Put it right there or vice versa.
We can embed the employee information inside the resume
document itself.
So, we have all the different choices, and how you probably
want to do it depends on how you access the data and how
frequently you access each piece of the data.
So, some of the considerations are as follows.
The first one is frequency of access.
Let's say, for example, that you constantly access the
employee information and their biographical information and
other information about the employee, but you very rarely
access their resume.
And let's say it's a very large collection, and you're
concerned about locality and working set size.
Well, you may decide to keep them in separate collections,
because you don't want to pull a resume into memory every
single time you pull the employee record-- employee
document-- into memory.
So, frequency of access has a lot of impact on how you'd
arrange this in terms of whether you'd embed it or not.
The second consideration is which of these are growing all
the time or not growing, the size of the items.
So, every time you add something to a document, there
is a point beyond which the document will need to be moved
in the collection.
And if you knew this was true for some of the documents but
not for other documents--
for instance , if you were never going to update the
employee record, but you were going to update the resume
part of it--
you might decide that you don't want to incur that
overhead when you write to the employee record if you're only
going to be updating the resume.
So that might be another reason why you decide to keep
them separate versus the same.
And, of course, if the resume is so large--
if it's actually larger than 16 megabytes, which is the
size of a document--
you might not be able to embed it.
I mean, it's not likely that it would be larger than 16
megabytes, but maybe it has some multimedia information or
there's a lot of historical information about the person
or event history, it could have that.
And the final consideration is atomicity of data.
Well, now there are no transactions in MongoDB, but
there are atomic operations on individual documents.
So, if you knew that you couldn't withstand any
inconsistency and that you wanted to be able to update
the entire employee plus the resume all the same time, you
may decide to put them into the same document and embed
them one way or the other so that you can
update it all at once.
All right.
It's time for a quiz.
What's a good reason you might want to keep two documents
that are related to each other in a 1 to 1 relationship in
separate collections?
Check all that apply.
Because you want to allow atomic update of both
documents at once.
To reduce the working set size of your application.
To enforce foreign key constraints.
Because the combined size of the documents would be larger
than 16 megabytes.


