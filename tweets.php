<div id="twitter" class="twitter">
	<h3><a href="http://twitter.com/<?php echo urlencode( Options::get( 'twitter__username' )); ?>">Twitter</a></h3>
	<?php foreach ($tweets as $tweet) : ?>
		<p><?php echo $tweet->text; ?></p>
		<a class="follow" href="http://twitter.com/<?php echo urlencode( Options::get( 'twitter__username' )); ?>">Follow Me</a>
		<a class="time" href="<?php echo $tweet->permalink; ?>"><?php echo $theme->relative_datetime( HabariDateTime::date_create($tweet->time)->format('U') ); ?></a>
	<?php endforeach; ?>
 </div>
