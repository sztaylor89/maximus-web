package Maximus::Schema::Result::Modscope;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';

__PACKAGE__->load_components("InflateColumn::DateTime");

=head1 NAME

Maximus::Schema::Result::Modscope

=cut

__PACKAGE__->table("modscope");

=head1 ACCESSORS

=head2 id

  data_type: INT
  default_value: undef
  extra: HASH(0x3bc1f14)
  is_auto_increment: 1
  is_nullable: 0
  size: 10

=head2 user_id

  data_type: INT
  default_value: undef
  extra: HASH(0x3bc1e74)
  is_foreign_key: 1
  is_nullable: 0
  size: 10

=head2 name

  data_type: VARCHAR
  default_value: undef
  is_nullable: 0
  size: 45

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
  "user_id",
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
);
__PACKAGE__->set_primary_key("id", "name");

=head1 RELATIONS

=head2 user

Type: belongs_to

Related object: L<Maximus::Schema::Result::User>

=cut

__PACKAGE__->belongs_to(
  "user",
  "Maximus::Schema::Result::User",
  { id => "user_id" },
  {},
);

=head2 modules

Type: has_many

Related object: L<Maximus::Schema::Result::Module>

=cut

__PACKAGE__->has_many(
  "modules",
  "Maximus::Schema::Result::Module",
  { "foreign.modscope_id" => "self.id" },
);


# Created by DBIx::Class::Schema::Loader v0.05003 @ 2010-04-24 12:19:11
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:xFn9V3OKkouxGWXEjgVd6A


# You can replace this text with custom content, and it will be preserved on regeneration
1;