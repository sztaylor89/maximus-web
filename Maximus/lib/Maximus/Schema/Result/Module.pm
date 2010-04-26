package Maximus::Schema::Result::Module;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';

__PACKAGE__->load_components("InflateColumn::DateTime");

=head1 NAME

Maximus::Schema::Result::Module

=cut

__PACKAGE__->table("module");

=head1 ACCESSORS

=head2 id

  data_type: INT
  default_value: undef
  extra: HASH(0x3bc3bd4)
  is_auto_increment: 1
  is_nullable: 0
  size: 10

=head2 modscope_id

  data_type: INT
  default_value: undef
  extra: HASH(0x3bc50a4)
  is_foreign_key: 1
  is_nullable: 0
  size: 10

=head2 name

  data_type: VARCHAR
  default_value: undef
  is_nullable: 0
  size: 45

=head2 desc

  data_type: VARCHAR
  default_value: undef
  is_nullable: 0
  size: 255

=head2 source

  data_type: VARCHAR
  default_value: undef
  is_nullable: 1
  size: 255

=head2 source_type

  data_type: ENUM
  default_value: undef
  extra: HASH(0x3bc3894)
  is_nullable: 0
  size: 6

=head2 source_options

  data_type: TEXT
  default_value: undef
  is_nullable: 1
  size: 65535

=cut

__PACKAGE__->add_columns(
  "id",
  {
    data_type => "INT",
    default_value => undef,
    extra => { unsigned => 1 },
    is_auto_increment => 1,
    is_nullable => 0,
    size => 10,
  },
  "modscope_id",
  {
    data_type => "INT",
    default_value => undef,
    extra => { unsigned => 1 },
    is_foreign_key => 1,
    is_nullable => 0,
    size => 10,
  },
  "name",
  {
    data_type => "VARCHAR",
    default_value => undef,
    is_nullable => 0,
    size => 45,
  },
  "desc",
  {
    data_type => "VARCHAR",
    default_value => undef,
    is_nullable => 0,
    size => 255,
  },
  "source",
  {
    data_type => "VARCHAR",
    default_value => undef,
    is_nullable => 1,
    size => 255,
  },
  "source_type",
  {
    data_type => "ENUM",
    default_value => undef,
    extra => { list => ["manual", "svn", "git"] },
    is_nullable => 0,
    size => 6,
  },
  "source_options",
  {
    data_type => "TEXT",
    default_value => undef,
    is_nullable => 1,
    size => 65535,
  },
);
__PACKAGE__->set_primary_key("id");
__PACKAGE__->add_unique_constraint("Index_3", ["modscope_id", "name"]);

=head1 RELATIONS

=head2 modscope

Type: belongs_to

Related object: L<Maximus::Schema::Result::Modscope>

=cut

__PACKAGE__->belongs_to(
  "modscope",
  "Maximus::Schema::Result::Modscope",
  { id => "modscope_id" },
  {},
);

=head2 module_versions

Type: has_many

Related object: L<Maximus::Schema::Result::ModuleVersion>

=cut

__PACKAGE__->has_many(
  "module_versions",
  "Maximus::Schema::Result::ModuleVersion",
  { "foreign.module_id" => "self.id" },
);


# Created by DBIx::Class::Schema::Loader v0.05003 @ 2010-04-24 12:19:11
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:hKLyWhseIc/t3C0zIkbd7w


use JSON::Any;
__PACKAGE__->inflate_column('source_options', {
	inflate => sub { JSON::Any->jsonToObj(shift) },
	deflate => sub { JSON::Any->objToJson(shift) },
});

1;