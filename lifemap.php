<div class="lifemap">
	<ul class="school">
		<?php foreach($life_items as $item): ?>
		<li class="item" data-start="<?php echo $item['time']['start']; ?>" data-end="<?php echo $item['time']['end']; ?>">
			<h3><?php echo $item['name']; ?></h3>
		</li>
	<?php endforeach; ?>
	</ul>
</div>