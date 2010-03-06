package Maximus::Schema::Result::DbixClassSchemaVersion;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

use strict;
use warnings;

use base 'DBIx::Class::Core';

__PACKAGE__->load_components("InflateColumn::DateTime");

=head1 NAME

Maximus::Schema::Result::DbixClassSchemaVersion

=cut

__PACKAGE__->table("dbix_class_schema_versions");

=head1 ACCESSORS

=head2 version

  data_type: VARCHAR
  default_value: undef
  is_nullable: 0
  size: 10

=head2 installed

  data_type: VARCHAR
  default_value: undef
  is_nullable: 0
  size: 20

=cut

__PACKAGE__->add_columns(
  "version",
  {
    data_type => "VARCHAR",
    default_value => undef,
    is_nullable => 0,
    size => 10,
  },
  "installed",
  {
    data_type => "VARCHAR",
    default_value => undef,
    is_nullable => 0,
    size => 20,
  },
);
__PACKAGE__->set_primary_key("version");


# Created by DBIx::Class::Schema::Loader v0.05001 @ 2010-03-06 20:54:22
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:MhOVMCDGljjkDtzthe4C+A


# You can replace this text with custom content, and it will be preserved on regeneration
1;