package Maximus::Class::Module;
use Moose;
use Moose::Util::TypeConstraints;
use Maximus::Exceptions;
use IO::File;
use namespace::autoclean;

subtype 'ModScope' => as Str => where {
    my $modscope = $_;
    foreach my $reservedScope (('brl', 'pub')) {
        return 0 if (lc($modscope) eq lc($reservedScope));
    }
    1;
} => message {"This modscope ($_) is reserved!"};

has 'modscope' => (is => 'rw', isa => 'ModScope', required => 1);

has 'mod' => (is => 'rw', isa => 'Str', required => 1);

has 'desc' => (is => 'rw', isa => 'Str', required => 1);

has 'source' => (
    is       => 'rw',
    does     => 'Maximus::Role::Module::Source',
);

has 'scm_settings' => (
    is      => 'rw',
    isa     => 'HashRef',
    default => sub { {} },
);

has 'schema' => (is => 'rw', 'isa' => 'DBIx::Class::Schema');

sub save {
    my ($self, $user) = @_;

    Maximus::Exception::Module->throw('schema is missing')
      unless $self->schema;

    Maximus::Exception::Module->throw('required parameter $user is missing')
      unless $user;

    my $rs_modscope = $self->schema->resultset('Modscope');
    my $modscope = $rs_modscope->find_or_new({name => $self->modscope});

    unless ($modscope->in_storage) {
        $modscope->insert;
        $user->create_related('user_roles',
            {role_id => $modscope->get_role($_)->id})
          for (qw/mutable readable/);
    }

    # A user can only upload a module for the given modscope if the user has
    # permission to use it
    my $modscope_id = $modscope->id;
    unless ($user->search_role_objects(qr/^modscope-$modscope_id-readable$/)
        || $user->is_superuser)
    {
        Maximus::Exception::Module->throw(
            error => 'Access denied to modscope',
            user_msg => 'This modscope doesn\'t belong to you');
    }

    my $mod = $self->schema->resultset('Module')->update_or_create(
        {   modscope_id  => $modscope->id,
            name         => $self->mod,
            desc         => $self->desc,
            scm_settings => $self->scm_settings,
        }
    );

    return $mod unless $self->source;

    $self->source->prepare($self);
    $self->source->validate($self) unless $self->source->validated;

    my @deps = $self->source->findDependencies($self);

    my $fh = IO::File->new_tmpfile;
    my $filename = $self->source->archive($self, $fh);

    my $archive;
    while (<$fh>) {
        $archive .= $_;
    }

    my $version;
    $self->schema->txn_do(
        sub {
            $version =
              $self->schema->resultset('ModuleVersion')->update_or_create(
                {   module_id       => $mod->id,
                    version         => $self->source->version,
                    archive         => $archive,
                    remote_location => undef,
                }
              );

            $version->module_dependencies->delete;
            $self->schema->resultset('ModuleDependency')->create(
                {   module_version_id => $version->id,
                    modscope          => $_->[0],
                    modname           => $_->[1],
                }
            ) foreach @deps;
        }
    );

    Maximus::Exception::Module->throw('Unable to save module to database')
      unless $version;

    return $version;
}

__PACKAGE__->meta->make_immutable;

=head1 NAME

Maximus::Class::Module - Represents a module

=head1 SYNOPSIS

	use Maximus::Class::Module;
	my $module = Maximus::Class::Module->new;

=head1 DESCRIPTION

This class represents a module

=head1 ATTRIBUTES

=head2 modscope

Modscope (namespace) of module, e.g. B<brl>.example

=head2 mod

Name of module, e.g. brl.B<example>

=head2 desc

Description of module

=head2 source

Source location. Needs to be a class which does L<Maximus::Role::Module::Source>

=head2 scm_settings

SCM specific settings

=head2 schema

L<DBIx::Class schema>

=head1 METHODS

=head2 save(I<$user>)

Save module in database. I<$user> should be a L<DBIx::Class::Row> from
L<Maximus::Schema::Result::User>.

When no I<source> has been given when constructing the object this method
returns the L<DBIx::Class::Row> that contains the record of the module.

=head1 AUTHOR

Christiaan Kras

=head1 LICENSE

Copyright (c) 2010-2011 Christiaan Kras

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

=cut

1;