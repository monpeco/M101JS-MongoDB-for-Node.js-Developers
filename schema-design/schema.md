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
