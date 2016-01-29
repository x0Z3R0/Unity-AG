#pragma strict

function Start () {
	InvokeRepeating("ChangeDirection",0,0.002);
}

function Update () {
	transform.Translate(Vector3.forward * 50 * Time.deltaTime,Space.Self);

}

function ChangeDirection(){
	var rand : int = Random.Range(-5.0,5);
	transform.eulerAngles.y += rand;
}
