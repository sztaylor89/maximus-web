package Maximus::Task::Modules::Update;
use Moose;
use Maximus::Task::Module::Update;

with 'Maximus::Role::Task';

=head1 NAME

Maximus::Task::Modules::Update - Update module database

=head1 SYNOPSIS

	use Maximus::Task::Modules::Update;
	$task->init;
	$task->run;

=head1 DESCRIPTION

Update module database.

=head1 METHODS

=head2 init

Initialize module update task
=cut
sub init { 1 }

=head2 run

Run task
TODO: Dispatch tasks, optionally, to Gearman...
=cut
sub run {
	my $self = shift;

	foreach my $row(Maximus->model('DB::Module')->all) {
		my($source, %options);
		
		if($row->source_type eq 'svn') {
			%options = (
				repository => $row->source,
				trunk => $row->source_options->{trunk},
				tags => $row->source_options->{tags} || '',
				tagsFilter => $row->source_options->{tagsFilter} || '',
			);

			$source = Maximus::Class::Module::Source::SCM::Subversion->new(
				%options
			);
		}
		
		if($source) {
			my $sourceClass = ref $source;
			my %versions = $source->getVersions();
			foreach my $version(keys(%versions)) {
				my $skipVersion = 0;
				if($version ne 'dev') {
					foreach($row->module_versions) {
						if($_->version eq $version) {
							$skipVersion = 1;
							last;
						}
					}
				}
				
				next if $skipVersion;
			
				my $s = $sourceClass->new(
					%options
				);
				$s->version($version);
				
				my $mod = Maximus::Class::Module->new(
					modscope => $row->modscope->name,
					mod => $row->name,
					desc => $row->desc,
					source => $s,
				);
				
				eval {
					my $task = Maximus::Task::Module::Update->new(
						mod => $mod,
						dbrow => $row,
					);
					die 'Failed to initialize' unless $task->init;
					die 'Failed to execute task' unless $task->run;
				};
				warn $@ if($@);
			}
		}
	}
	
	1;
}

=head1 AUTHOR

Christiaan Kras

=head1 LICENSE

Copyright (c) 2010 Christiaan Kras

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
