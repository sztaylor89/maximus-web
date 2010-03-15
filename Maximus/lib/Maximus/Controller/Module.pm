package Maximus::Controller::Module;
use IO::File;
use JSON::Any;
use XML::Simple;
use Moose;
use namespace::autoclean;

BEGIN {extends 'Catalyst::Controller'; }

=head1 NAME

Maximus::Controller::Module - Catalyst Controller

=head1 DESCRIPTION

Catalyst Controller for Modules;

=head1 METHODS

=cut


=head2 index

=cut

sub index :Path :Args(0) {
    my ( $self, $c ) = @_;

    $c->response->body('Matched Maximus::Controller::Module in Module.');
}

=head2 sources

Retrieve sources file
=cut
#sub sources :PathPart('sources') {
sub sources :Chained('/') :PathPart('module/sources') :CaptureArgs(0) {
	my($self, $c) = @_;
	my $db = $c->model('MongoDB')->db;
	my $sources = {};
	
	foreach my $module($db->get_collection('modules')->query->all) {
		my $scope = $module->{scope};
		my $mod = $module->{mod};
		$sources->{$scope}->{$mod}->{desc} = $module->{desc};
		$sources->{$scope}->{$mod}->{versions} = {};
		my $versions = $sources->{$scope}->{$mod}->{versions};
		
		foreach my $version(@{$module->{versions}}) {
			my $v = $version->{version};
			$versions->{$v} = {
				deps => [],
				url => $c->uri_for('download', $version->{filename})->as_string,
			};
		}
		
	}

	$c->stash->{sources} = $sources;
}

=head2 /module/sources/json

Sources file in JSON
=cut
sub sources_json :Chained('sources') :PathPart('json') :Args(0) {
	my($self, $c) = @_;
	
	$c->res->content_type('application/json');
	$c->res->body(
		JSON::Any->objToJson($c->stash->{sources})
	);
}

=head2 /module/sources/xml

Sources file in XML
=cut
sub sources_xml :Chained('sources') :PathPart('xml') :Args(0) {
	my($self, $c) = @_;
	
	$c->res->content_type('text/xml');
	$c->res->body(
		XMLout($c->stash->{sources})
	);
}

=head2 download

=cut
sub download :Local :Args(1) {
	my($self, $c, $filename) = @_;
	my $db = $c->model('MongoDB')->db;
	my $grid = $db->get_gridfs;

	my $file = $grid->find_one({'filename' => $filename});
	$c->detach('/default') unless $file;
	
	my $fh = IO::File->new_tmpfile;
	$file->print($fh);
	
	$c->res->header('Content-Disposition', qq[attachment; filename="$filename"]);
	$c->res->header('ETag', $file->info->{md5});
	$c->res->header('Content-Length', $file->info->{length});
	$c->res->content_type('application/x-zip');
	$c->res->body($fh);
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

__PACKAGE__->meta->make_immutable;
