#pragma strict
public var Target : GameObject;
public var canShoot : boolean = true;

public var Vectores : double[] = new double[180]; //ANGULO QUE SE SUMARA QUEDA GUARDADO AQUI
public var Vectores_scores : double[] = new double[180]; //PUNTUACION DEL ANGULO GUARDADO ARRIBA


//Fallos y aciertos totales
public var fallos : long = 0;
public var aciertos : long = 0;

//Porcentaje acierto
public var porc : double = 0f;
//Contador disparos para sacar porcentaje cada 100.
private var shoots : int = 0;
//Numero de aciertos cada 100 disparos.
private var aciertos_100 : int = 0; 


public var debug : boolean = true;

function Start(){
	Target = GameObject.Find("Target");
	var i = 0;
	while(i < 180){
		Vectores[i] = 3.5;  // !!!! PUEDE QUE POR ESTO TARDE MAS EN CONVERGER DEBERIA COMENZAR EN 0 ?
		Vectores_scores[i] = 100000;
		i++; 
	}
}

function CalculatePercentage(){
	shoots = 0;
	porc = aciertos_100 / 100.0;
	aciertos_100 = 0; 
}

function Update(){
	if(canShoot){
		shoots++;
		Shoot();
	}
	if(shoots == 99){
		CalculatePercentage();
	}
}
function Shoot(){
	canShoot = false;
	var desfase_direccion : int = Vector3.Angle(Target.transform.position-transform.position,Target.transform.forward);
	desfase_direccion = desfase_direccion % 180;
	gameObject.transform.LookAt(Target.transform);
	var new_shoot_vector : double = Vectores[desfase_direccion] + (Random.Range(-20,20) / 10.0);
	transform.eulerAngles.y += new_shoot_vector;
	yield WaitForSeconds(0.02);
	var rh : RaycastHit;
	if(debug)
		Debug.Log("Angulo: " + desfase_direccion + ";Vector: " + Vectores[desfase_direccion] + ";Nuevo vector: " + new_shoot_vector);
	
	if(Physics.Raycast(transform.position,transform.forward,rh,Vector3.Distance(Target.transform.position,transform.position) + 10,Space.Self)){
		Debug.DrawRay(transform.position,transform.forward * Vector3.Distance(Target.transform.position,transform.position),Color.green,1,Space.Self);
		if(rh.collider.gameObject.name == Target.name){
			//Debug.Log("ACIERTO");
			aciertos++;
			aciertos_100++;
			if(Vector3.Distance(Target.transform.position,rh.point) < Vectores_scores[desfase_direccion]){
				Vectores_scores[desfase_direccion] = Vector3.Distance(Target.transform.position,rh.point);
				Vectores[desfase_direccion] = new_shoot_vector;
				if(debug)
					Debug.Log("Mejora en vector: " + desfase_direccion);
			}
		}
	}else{
		fallos++;
		Debug.DrawRay(transform.position,transform.forward * Vector3.Distance(Target.transform.position,transform.position),Color.red,1,Space.Self);
		var point : Vector3 = transform.forward * Vector3.Distance(Target.transform.position,transform.position);
		if(Vector3.Distance(point,Target.transform.position)< Vectores_scores[desfase_direccion]){
			//Debug.Log("FALLO");

			Vectores_scores[desfase_direccion] = Vector3.Distance(Target.transform.position,point);
			Vectores[desfase_direccion] = new_shoot_vector;
			if(debug)
				Debug.Log("Mejora en fallo en vector: " + desfase_direccion);
		}
