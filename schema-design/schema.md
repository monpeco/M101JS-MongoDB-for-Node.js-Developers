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


---

### m101 13 one to many

https://youtu.be/EIaP1KbVkUc

Let's talk about one to many relationships.
So a one to many relationship is where there's two entities
and there's many, many entities or many entities that
map to the one entity.
So for an example, you have a city and you have the people
or persons who live in that city.
So an example would be New York City, which has 8 million
people in it.
How are you going to model that?
Well, we could go through it and think about different ways
you might want to do it.
So, you might say, well, I'm going to have a city
collection.
And in that city collection, I'm going to have the
attributes of the city, like the name of the
city, and its area.
And then I'm going to have the people that live in the city
as an array.
But that won't work.
Because, of course, there are way too many people.
8 million people and all their documents and all their
information, it isn't going to fit inside this.
So, as a result, you can't do that.
You could say, well, I'll flip it on its head.
So instead, I could say, well, I'm going to have a people
collection.
And the people collection, in each document, I'm going to
have a name, like Andrew.
And then I'm going to have the city.
And that's going to be another document.
And it's going to have a name, like New York, and an area,
and everything else.
Now the problem with this design is that if there are
obviously multiple living in New York, so what I've done is
I've duplicated this data in multiple documents, which is
going to open me up to inconsistencies because I have
to keep the city information updated across all the people
who live in the city.
Now, in certain designs, that might be acceptable.
But I probably wouldn't recommend it in general.
So given that, what's the best way to do it?
Well, in this case, where there truly is one to many,
one city with many people, the best way to do it is probably
to use true linking.
So we'll use true linking.
So for true linking, we're going to have a people
collection.
And in that people collection, we're going to have something
like the name of the person, like Andrew, and then,
probably, my city, which let's assume that the city names are
unique, New York City being unique, and other
attributes about me.
And then, in the city collection, I would have an
underscore ID being New York City, and other attributes
about the city listed out.
So, in this case, I would link from the item
where there was many.
So, I would have a collection of the many, the people.
And I would link into the one, into the city.
And again, knowing we have no foreign key constraints, you
just have to make sure that you're consistent about it and
that you don't put a city in that isn't also an underscore
ID for the collection that it refers to.
So that's a fine solution for one to many.
And it requires two collections.
So that requires two collections.
But what if it isn't one to many, but
instead it's one to few?
Which is still a one to many relationship, but is actually
a lot easier to model inside mongoDB.
So the example I gave you before was these blog posts
and the comments.
And you saw, when we went over the schema for the blog, that
there are multiple comments that go to one blog post.
But it isn't very many of them.
So it's blog post, sorry, to comment.
There's is one of these and maybe 10 of these.
And, so in that case, it's feasible to have a collection
of the one.
So to have a post collection, which is what we did.
And then, within each post, you had the name of the posts,
and then somewhere you had an array of the comments.
And then, that array contained all the comments, but there's
only a few of them for each post.
And again, we don't have the duplication of data problem
because every comment is only within a single post.
So in this particular model, it works very well to have a
single collection.
And we're going to have a single collection of the one,
of the posts.
And then put the many embedded.
So those are the two different ways to handle the one to many
relationship, depending on whether it's one to few, or
one to many.
If it's truly one to many than two collections works best
with linking.
And if it's just one to few, well, then you could probably
get away with a single collection, like we did in the
blogging example, where you just embed the
items within it.
All right, so it's time for a quiz.
So, when is it recommended to represent a one to many
relationship in multiple collections?
And the answers are, always, whenever the many is large,
whenever the many is actually few, or never.
What's the answer?


---

### m101 15 many to many
    
https://youtu.be/fEYYjZ7zEHc

The next relation we're going to go over is the
many-to-many relation.
An example of a many-to-many relation
would be books to authors.
Each book could have more than one author.
And each author could have more than one book.
Or another example would be students and teachers.
A student has multiple teachers, and a teacher has
multiple students.
So the thing to note in both these cases and in many world
cases is that, although it is a many-to-many relation, there
are not a very large number of authors for each book or a
very large number of books for each author.
Instead, it tends to be few to few.
And that's going to allow us to use the hierarchy and the
rich document structure of MongoDB pretty easily, whereas
it wouldn't be possible if it were truly many-to-many.
So let's look at books to authors.
Although there are probably a large number of books and
there are probably a large number of authors, as we said,
each book probably has a small number of authors, and each
author has a small number of books.
And so what we can do is we can link them by creating an
array, write the document.
So for instance, in this author's document that I'm
showing on the right, I can put a book ID right in here,
plus the book ID of other books that this author might
have written.
Now, I could go in both directions.
And I could, if I wanted, also create an author's key in the
books collection and have an array of
authors for each book.
In this case, this particular book, Gone with the Wind,
written by Margaret Mitchell, has only a single author.
So I'll just put a single author in here.
And whether this makes sense depends a lot
on the access patterns.
If you want to be able to quickly traverse from a book
to its authors, then it could make sense, without doing
additional query, to have it link in that direction.
And vice versa if you want to start with authors and get
quickly to books.
Now, having them linked in both directions probably
wouldn't be my preference, because it creates the
opportunity to have the data be inconsistent if it's not
tied together well.
But you can do it, if you want to, for performance reasons.
Now, the other option is you could just embed it.
So you could, for instance, rather than have this array
here, we could just embed the book--
I'm going to cross this out.
And you could embed the book right in the author collection
and put information about the book that the author has
written right in here.
But I don't love that, because what's going to happen is that
the book is going to wind up--
not often, because it doesn't usually have multiple
authors-- but it could wind up in the author's collection
multiple times, duplicated, and open this up to having
update anomalies, modification anomalies, where the
information doesn't stay consistent.
Now, if that's what you need for performance reasons, you
need to embed the book inside the author collection, then by
all means, do it.
But I'd avoid it unless you need to do it
for performance reasons.
In this particular case, I'd make books and authors both a
first-class object.
It's also important to remember that there are no
foreign key constraints inside MongoDB, as we
talked about earlier.
So there's no guarantee that, if you put an ID here, that
it's going to appear over here.
All right, so next, let's talk about the students and
teachers relationship.
So students and teachers looks a lot like books and authors,
where a teacher can have multiple students, and a
student can have multiple teachers.
And I'd probably handle it the same way.
I'd have a student collection, and I'd have a teachers
collection.
And I'd have the information about the student listed in
the student collection, and the information about teacher
listed in the teacher collection.
And then I would link in one direction or the other.
And I would have array of items.
If I want to know the students for this teacher, I could put
that right in here and find the students very quickly.
And I might link in both directions and also have an
array of teachers in my students collection.
Now, again, you could embed.
At the risk of duplicating data, you could decide that
you want to put the teachers inside the student collection.
This is instead of being an array of object IDs or
underscore IDs that need to then be traversed through
initial queries in the application.
You could just put the data right inside the collection.
Now, that wouldn't be a good idea in the case of embedding
teachers in the student collection.
And the reason this there's a very good chance that you want
to insert a teacher into the system before he has students.
And you may want to insert a student into the system before
he has teachers.
And if you do embed like that, then you are requiring that
the parent object exists in order to
represent the child object.
And that may not map to what the
application wants to permit.


---

### multikey

https://youtu.be/KtIY4Q1tUao

```
db.students.find();
{"_id" : 0, "name" : "Andrew", "teachers" : [ 0, 1 ]}
{"_id" : 1, "name" : "Richard", "teachers" : [ 0, 1, 3]}
{"_id" : 2, "name" : "Eliot", "teachers" : [ 1, 2, 3]}
{"_id" : 3, "name" : "Mark", "teachers" : [ 0, 3]}

db.teachers.find();
{"_id" : 0, "name" : "Mark Horowitz" }
{"_id" : 1, "name" : "John Hennessy" }
{"_id" : 2, "name" : "Bruce Wolley" }
{"_id" : 3, "name" : "James Plummer" }


db.students.ensureIndex({'teachers':1});

db.students.find({'teachers' : {$all:[0,1]}})
```
One of the reasons that linking and embedding works
so well within MongoDB is because of the existence
of a feature called multikey indexes.
I'm going to talk a little bit about multikey indexes
and why they're so useful within MongoDB.
Now, let's say you had a schema that included students
and teachers, and this is a schema that we've seen before.
And these are two example documents
from these collections.
The students collection might have
a separate document for each student
with a unique underscore ID, a name for each student,
and a key for the teachers, where
the value is a list of the underscore ID values for all
the teachers that the student has.
And on the other side, we have this teachers collection,
which has a document for each teacher
with a unique underscore ID, an integer
value, and a name for each teacher.
And here you can see we have Tony Stark is
the only teacher in the collection right now.
And so this says right here that Andrew has had four teachers
and that one of them is Tony Stark.
Now, there are two possible queries,
or I should say two obvious queries.
And one is, how can I find all the teachers
that a particular student has had?
And the other is, how can I find all the students who
have had a particular teacher?
Now, let's go over the first one which
is, how do I find the teachers for a particular student?
Now, that one is straightforward because I can simply
search this collection.
I can query the students collection.
I could do db.students.find.
I can specify the student I'm looking for,
and then return the teacher's key with its values,
and then I'll know the teachers.
But what about finding all the students who
have had a particular teacher?
That's a more difficult query.
That query is going to use our set operators.
And in order for that to be efficient,
we need to be able to use an index.
And it's going to be a multikey index that makes this possible.
So let me show you in the shell how this looks.
All right.
So we have two different collections already
set up here.
We have a students collection, and we
have a teachers collection.
Here's the students collection, and here's
the teachers collection.
And we can see that the students collection has
a list of students, including myself,
and the teachers that I had.
And here in the teachers collection,
we have a list of professors, and these
are the professors that were teaching
when I was at Stanford.
And we can see that, for instance, I
had the teacher 0 and 1, which are
Mark Horowitz and John Hennessy.
Now, if we wanted to add a multikey index on this teachers
key, we could do it as follows, db.students.ensureIndex
'teachers' 1.
And we haven't gone over indexes yet,
but this is how you'd create them.
And now the shell returns information
that before there was one index, which
was the index on underscore ID which is in every collection,
and now there are two.
And now we're going to do a query that's
going to use that index and be efficient.
So let's find all the students who
had Mark Horowitz and John Hennessy as professors.
So Mark Horowitz is 0, and John Hennessy 1.
So we'll db.students.find 'teachers," now we're all.
There we go.
So now, we do a query, and we ask,
find me all the students that had
both 0 and 1 in their teacher's value.
And we find that it's me, Andrew Erlichson,
and it's also Richard Kreuter.
He has also 0 and 1 in the teacher's value.
Now, the question is, how do we know that that used an index?
Well, there's a little command that we haven't talked
about yet, but it works like this.
We can append explain at the end of this query.
And if we append explain at the end of this query,
it will tell us what it did when it was performing the query.
And if we do that, we can see here
that it returns a bunch of information,
but what it tells us is that it used the BtreeCursor
teachers underscore 1 index, which is a multikey index.
And that's how multikey indexes work
and why they make linking and embedding an efficient way
to represent information within MongoDB when you query it.


---

### m101 17 benefits of embedding

https://youtu.be/XIN0Dqht08Q

The main benefit of embedding data from two different
collections and bringing it together into one collection
is performance.
And the main performance benefit comes from improved
read performance.
Now, why do we get improved read performance?
The reason is the nature of the way these systems are
built, the computer systems are built, which is they often
have spinning disks, and those spinning disks have a very
high latency, which means they take a long time to get to the
first byte.
They often take over one millisecond to get to the
first byte.
But then, once they get to the first byte, each additional
byte comes pretty quickly.
So they tend to be pretty high bandwidth.
So the idea is that, if you can co-locate the data that
you're going to use together in the same document, embed
it, then you're going to spin the disk, find the sector
where you need this information, and then you're
going to start reading it.
And you're going to get all the information
you need in one go.
And it also means, if you have two pieces of data that would
normally be in two collections or in several relational
tables, but instead they're in one document, that you avoid
round trips to the database.
Because now, in one round trip, you can go in, you can
read the data, and you can get back out.
Same thing with a write.
In one trip, you can go to the database, you can write the
data you need, which would normally potentially go into
multiple different parts of the system and parts of disk,
write one location on the disk, and then get back out.
And the only real caveat on this is, as I said earlier, if
a document winds up getting moved a lot more often because
you've brought the data together because the document
needs to be expanded, then you could create a problem.
You could slow down your writes
because of the embedding.
So again, it all comes down to your access patterns with
MongoDB and trying to design a schema around the access
patterns that you see in your actual application.


---

### m101 18 representing trees


https://youtu.be/lIjXyQklGWY


One classic problem from the world of schema design is how
do you represent a tree inside the database?
Let's look, for example, at the problem of representing
the e-commerce categories in a e-commerce site, such as
Amazon, where you might have home, outdoors, winter, snow.
And the idea here is that you've got these products.
And they're in a products collection.
They have a product name and a bunch of
attributes in the product.
And they have some category, like say, category seven.
And then, you have some other category collection, where you
can look up category seven, you can see the category name,
some of the properties about the category.
And one way to model it is you could keep its parent ID,
right here.
And that would be the way you might do it in a simple
relational database.
But this doesn't make it very easy to find all the parents
to this category.
You'd have to iteratively query, find the parent of
this, then find the parent of that, until you get all the
way to the top.
So an alternative way to do it, inside mongoDB, is to be
able to list ancestors or children.
So let's think about that and how that would work.
So you could decide to list all the
children of this category.
But that's also fairly limiting, if you're looking to
be able to look and find the entire sub-tree that is above
a certain piece of the tree.
Instead, what works pretty well, and again, enabled by
the ability to put arrays inside mongoDB
is to list the ancestors.
So let's say I decided to list all the ancestors of this from
the top in order.
Now, using this one piece of information I can find all of
the parent categories of this category.
If I want to list the bread crumbs and make it easy for
the user to navigate the site.
And again, the ability to structure and express rich
data is one of the things that makes mongoDB so interesting.
This would be very difficult to do in
a relational database.
Now, in terms of how you represent the data for
something like a product category hierarchy, again, it
all depends on your access pattern.
It depends on how you believe you're going to need to show
the data, access the data for the user.
And then, based on that, you know how to model it.
All right, it's time for a quiz on
representing trees in mongoDB.
Given the following typical document for an e-commerce
category hierarchy called categories, and here's the
document that's in the category collection, which of
these queries will find all the descendants of the
snorkeling category?
And this is the snorkeling category right here.
Which of these queries?

---

### m101 20 when to denormalize

https://youtu.be/jDZ-HFoJ0vg


We started out this unit talking about the third normal
form and denormalization.
And if you recall, one of the reasons why you normalize data
in the relational world is because you want to avoid
modification anomalies that come with the
duplication of data.
And when you look at MongoDB and how it's structured,
allowing these rich documents, it's easy to assume that what
we're doing is we're denormalizing data.
And to a certain extent, that's true.
But as long as we don't duplicate data, we don't open
ourselves up to modification anomalies.
So looking back at what we went over in this unit, we
talked about one-to-one relationships.
And in that case, it's perfectly safe to embed the
data if you'd like.
And you don't open yourself up to these modification
anomalies, because you're not duplicating the data.
You're basically just taking something that would normally
be in a separate table, and you're folding it
into another table.
And that doesn't necessarily duplicate any data.
Now, when you have a one-to-many relationship, then
embedding can also work well without duplication of data,
as long as you embed from the many to the one.
Now, if you want to go from the one to the many, then
linking would avoid the duplication of data.
Now, again, if you need to embed something, even if it
causes duplication of data, for performance reasons, to
match the access patterns of your application, then that
could make sense, especially if the data is rarely changing
or being updated.
But you can avoid it often enough, even in this
relationship, if you go from the many to the one.
So in the many-to-many relation, which we looked at
with students and teachers and authors and books, there, if
you want to avoid the modification anomalies that
come with denormalization, all you need to do is link through
these arrays of object IDs in the documents.
And if you need to, for performance reasons or for
other reasons, matching some type of query you have to do
for your application, then you can embed data.
But do realize that you might be duplicating some data.
And it's up to you as the application programmer to keep
it all up to date.

