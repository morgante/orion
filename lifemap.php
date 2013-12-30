<div class="lifemap">
	<ul class="scopes">

		<li data-scope-name="business" data-scope-color="blue">Business</li>
						<li data-scope-name="tech" data-scope-color="green">Technology</li>

				<li data-scope-name="education" data-scope-color="red">School</li>

	</ul>
	<ul class="items">
	<?php foreach($life_items as $item): ?>
		<li class="item" data-start="<?php echo $item['time']['start']; ?>" data-life-scopes="<?php echo implode(' ', $item['scopes']); ?>">
			<h3><?php echo $item['name']; ?></h3>
		</li>
	<?php endforeach; ?>
	</ul>

	<canvas id="myLifemap" resize></canvas>
</div>